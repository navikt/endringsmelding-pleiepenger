import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { isFeatureEnabled, Feature } from '../utils/featureToggleUtils';
import api from './api';

type SoknadTempStorageRemoteData = RemoteData<AxiosError<any>, SoknadTempStorageData>;

const getSoknadTempStorage = async (): Promise<SoknadTempStorageRemoteData> => {
    try {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            const { data } = await api.psb.get<SoknadTempStorageData>(ApiEndpointPsb.mellomlagring);
            return Promise.resolve(success(data));
        }
        return Promise.resolve(success({} as SoknadTempStorageData));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSoknadTempStorage;
