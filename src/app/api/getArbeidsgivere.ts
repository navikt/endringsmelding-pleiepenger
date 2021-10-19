import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Arbeidsgivere } from '../types/Arbeidsgiver';
import api from './api';

export type SokerRemoteData = RemoteData<AxiosError, Arbeidsgivere>;

const getArbeidsgivereRemoteData = async (fom?: string, tom?: string): Promise<SokerRemoteData> => {
    try {
        const { data } = await api.psb.get<Arbeidsgivere>(
            ApiEndpointPsb.arbeidsgiver,
            `?fra_og_med=${fom}&til_og_med=${tom}`
        );
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgivereRemoteData;
