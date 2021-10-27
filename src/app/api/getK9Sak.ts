import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
// import { ApiEndpointInnsyn } from '../../types/ApiEndpoint';
import { K9Sak } from '../types/K9Sak';
import { parseK9Format } from '../utils/parseK9Format';
// import api from '../api';
import { k9SakMock } from './mock/k9sakMock';
// import { K9SakRemote } from './k9SakRemote';

const getK9SakRemoteData = async (): Promise<RemoteData<AxiosError, K9Sak>> => {
    try {
        const data = k9SakMock; // await api.innsyn.get<K9SakRemote>(ApiEndpointInnsyn.k9sak);
        const k9sak = parseK9Format(data);
        return Promise.resolve(success(k9sak));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getK9SakRemoteData;
