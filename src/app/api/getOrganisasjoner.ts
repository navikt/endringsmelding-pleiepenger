/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Organisasjon } from '../types/Organisasjon';
import api from './api';

interface OrganisasjonResponseType {
    [organisasjonsnummer: string]: string;
}

export type OrganisasjonerRemoteData = RemoteData<AxiosError, Organisasjon[]>;

export const getOrganisasjoner = async (orgnr: string[]): Promise<OrganisasjonerRemoteData> => {
    if (orgnr.length === 0) {
        return Promise.resolve(success([]));
    }
    try {
        const { data } = await api.psb.get<OrganisasjonResponseType>(
            ApiEndpointPsb.organisasjoner,
            `?${orgnr.join('&orgnr=')}`
        );
        const organiasjoner = Object.keys(data).map(
            (organisasjonsnummer): Organisasjon => ({ organisasjonsnummer, navn: data[organisasjonsnummer] })
        );
        return Promise.resolve(success(organiasjoner));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};
