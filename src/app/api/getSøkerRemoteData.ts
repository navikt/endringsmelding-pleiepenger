import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { isSøkerRemoteData, Søker } from '../types/Søker';
import api from './api';
import { ApiEndpointPsb } from './endpoints';

export type SøkerRemoteData = RemoteData<AxiosError, Søker>;

const getSøkerRemoteData = async (): Promise<RemoteData<AxiosError, Søker>> => {
    try {
        const { data } = await api.psb.get<Søker>(ApiEndpointPsb.soker);
        if (!isSøkerRemoteData(data)) {
            return Promise.reject(failure('Invalid søkerdata'));
        }
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSøkerRemoteData;
