import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getArbeidsgivereRemoteData from '../api/getArbeidsgivere';
import getK9SakRemoteData from '../api/getK9Sak';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import { Arbeidsgivere } from '../types/Arbeidsgiver';
import { K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { relocateToLoginPage } from '../utils/navigationUtils';

export type SoknadEssentials = [Person, Arbeidsgivere, K9Sak, SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, arbeidsgivereResult, k9SakResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getArbeidsgivereRemoteData(),
                getK9SakRemoteData(),
                getSoknadTempStorage(),
            ]);
            setData(combine(sokerResult, arbeidsgivereResult, k9SakResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUserLoggedOut(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
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
