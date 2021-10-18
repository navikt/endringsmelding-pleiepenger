import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointInnsyn } from '../types/ApiEndpoint';
import { K9Sak } from '../types/K9Sak';
import api from './api';

export type K9SakRemoteData = RemoteData<AxiosError, K9Sak>;

const getK9SakRemoteData = async (): Promise<K9SakRemoteData> => {
    try {
        const { data } = await api.innsyn.get<K9Sak>(ApiEndpointInnsyn.k9sak);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getK9SakRemoteData;
