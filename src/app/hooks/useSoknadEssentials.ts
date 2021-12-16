import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getArbeidsgivereRemoteData from '../api/getArbeidsgivere';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import getK9SakRemoteData from '../api/getK9Sak';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { getEndringsdato, getEndringsperiode } from '../utils/endringsperiode';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { dateToISODate } from '../utils/dateUtils';
import { getDateRangeForK9Saker } from '../utils/k9SakUtils';

export type SoknadEssentials = [Person, K9Sak[], Arbeidsgiver[], SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);

    const fetch = async () => {
        try {
            const [sokerResult, k9SakerResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getK9SakRemoteData(),
                getSoknadTempStorage(),
            ]);

            /** Hent arbeidsgivere fra aa-reg */
            const k9saker: K9Sak[] = k9SakerResult._tag === 'RemoteSuccess' ? k9SakerResult.value : [];
            const endringsperiode = getEndringsperiode(getEndringsdato(), [getDateRangeForK9Saker(k9saker)]);
            // const arbeidstakereISak = getArbeidsgivereIK9Saker(k9saker);
            const arbeidsgivereResult = await getArbeidsgivereRemoteData(
                dateToISODate(endringsperiode.from),
                dateToISODate(endringsperiode.to)
                // k9saker[0].ytelse.opptjeningAktivitet.arbeidstaker
            );
            setData(combine(sokerResult, k9SakerResult, arbeidsgivereResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUnauthorized(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                console.error(remoteDataError);
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
