import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointInnsyn } from '../types/ApiEndpoint';
import { K9Format } from '../types/k9Format';
import { K9Sak } from '../types/K9Sak';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { parseK9Format } from '../utils/parseK9Format';
import api from './api';
import { k9SakMock } from './mock/k9sakMock';

export type K9FormatRemote = RemoteData<AxiosError, K9Format[]>;

const getK9SakRemoteData = async (): Promise<RemoteData<AxiosError, K9Sak[]>> => {
    if (isFeatureEnabled(Feature.FAKE_API_KALL)) {
        try {
            const data = k9SakMock;
            const k9sak = parseK9Format(data[0]);
            return Promise.resolve(success([k9sak]));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    } else {
        try {
            const { data } = await api.innsyn.get<K9Format[]>(ApiEndpointInnsyn.k9sak);
            const k9saker: K9Sak[] = [];
            data.forEach((sak) => {
                k9saker.push(parseK9Format(sak));
            });
            return Promise.resolve(success(k9saker));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    }
};

export default getK9SakRemoteData;
