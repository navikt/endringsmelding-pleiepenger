import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData, failure } from '@devexperts/remote-data-ts';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToISODate } from '@navikt/sif-common-utils';
import { AxiosError } from 'axios';
import getArbeidsgivereRemoteData from '../api/getArbeidsgivereRemoteData';
import getSakerRemoteData from '../api/getSakerRemoteData';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import getSøkerRemoteData from '../api/getSøkerRemoteData';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { Sak } from '../types/Sak';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { Søker } from '../types/Søker';
import appSentryLogger from '../utils/appSentryLogger';
import { getEndringsdato, getEndringsperiode } from '../utils/endringsperiode';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { getDateRangeForSaker } from '../utils/sakUtils';

export enum ESSENTIALS_ERROR {
    INGEN_AKTIVE_SAKER = 'INGEN_AKTIVE_SAKER',
}

export type SoknadEssentials = [Søker, Sak[], Arbeidsgiver[], SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);

    const fetch = async () => {
        try {
            const [søkerResult, sakerResult, soknadTempStorageResult] = await Promise.all([
                getSøkerRemoteData(),
                getSakerRemoteData(),
                getSoknadTempStorage(),
            ]);

            /** Hent arbeidsgivere fra aa-reg */
            const saker: Sak[] = sakerResult._tag === 'RemoteSuccess' ? sakerResult.value : [];
            const dateRangeForSaker = getDateRangeForSaker(saker);
            if (!dateRangeForSaker) {
                throw failure(ESSENTIALS_ERROR.INGEN_AKTIVE_SAKER);
            }
            const endringsperiode = getEndringsperiode(getEndringsdato(), [dateRangeForSaker]);
            const arbeidsgivereResult = await getArbeidsgivereRemoteData(
                dateToISODate(endringsperiode.from),
                dateToISODate(endringsperiode.to)
            );
            setData(combine(søkerResult, sakerResult, arbeidsgivereResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUnauthorized(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                appSentryLogger.logError('useSoknadEssentials', remoteDataError.error);
                setData(remoteDataError);
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
