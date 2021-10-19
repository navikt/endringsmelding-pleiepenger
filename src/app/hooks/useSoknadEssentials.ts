import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { AxiosError } from 'axios';
import getArbeidsgivereRemoteData from '../api/getArbeidsgivere';
import getK9SakRemoteData from '../api/k9sak/getK9Sak';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import { Arbeidsgivere } from '../types/Arbeidsgiver';
import { K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { getMinMaxInDateRanges } from '../utils/dateUtils';
import { getEndringsdato, getEndringsperiode } from '../utils/getEndringsperiode';
import { relocateToLoginPage } from '../utils/navigationUtils';

export type SoknadEssentials = [Person, K9Sak, Arbeidsgivere, SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, k9SakResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getK9SakRemoteData(),
                getSoknadTempStorage(),
            ]);
            const k9sak: K9Sak = (k9SakResult as any).value as any;
            const endringsdato = getEndringsdato();
            const søknadsperiode = getMinMaxInDateRanges(k9sak.ytelse.søknadsperiode);
            const endringsperiode = getEndringsperiode(endringsdato, søknadsperiode);
            const arbeidsgivereResult = await getArbeidsgivereRemoteData(
                dateToISOString(endringsperiode.from),
                dateToISOString(endringsperiode.to)
            );
            setData(combine(sokerResult, k9SakResult, arbeidsgivereResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUserLoggedOut(remoteDataError.error)) {
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
