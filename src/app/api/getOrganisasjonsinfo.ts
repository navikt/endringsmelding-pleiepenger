/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { Organisasjon } from '../types/Organisasjon';

export type ArbeidsgiverRemoteData = RemoteData<AxiosError, Organisasjon[]>;

const getOrganisasjonsinfo = async (orgnr: string[]): Promise<ArbeidsgiverRemoteData> => {
    try {
        const mockResult: Organisasjon[] = [
            // { organisasjonsnummer: '907670202', navn: 'NYE KLONELABBEN', ansattFom: ISODateToDate('2021-10-01') },
            {
                organisasjonsnummer: '967170232',
                navn: 'Bakeriet smått og godt',
            },
        ];
        return Promise.resolve(success(mockResult));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getOrganisasjonsinfo;
