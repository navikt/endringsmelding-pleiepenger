import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import { Person } from '../types/Person';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { relocateToLoginPage } from '../utils/navigationUtils';

export type SoknadEssentials = [Person, SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getSoknadTempStorage(),
            ]);
            setData(combine(sokerResult, soknadTempStorageResult));
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
