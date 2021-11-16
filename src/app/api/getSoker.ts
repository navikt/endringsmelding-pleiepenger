import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Person } from '../types/Person';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import api from './api';

export type SokerRemoteData = RemoteData<AxiosError, Person>;

const getSokerRemoteData = async (): Promise<SokerRemoteData> => {
    if (isFeatureEnabled(Feature.FAKE_API_KALL)) {
        return Promise.resolve(
            success({
                fødselsnummer: '12345678901',
                fornavn: 'GODSLIG',
                mellomnavn: '',
                etternavn: 'KRONJUVEL',
                kontonummer: '17246746060',
                kjønn: 'M',
            })
        );
    }
    try {
        const { data } = await api.psb.get<Person>(ApiEndpointPsb.soker);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSokerRemoteData;
