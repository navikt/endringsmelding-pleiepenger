import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { isK9Format, K9Format } from '../types/k9Format';
import { Sak } from '../types/Sak';
import { parseK9Format } from '../utils/parseK9Format';
import api from './api';
import { ApiEndpointInnsyn } from './endpoints';

export type SakerRemoteData = RemoteData<AxiosError, K9Format[]>;

const getSakerRemoteData = async (): Promise<RemoteData<AxiosError, Sak[]>> => {
    try {
        const { data } = await api.innsyn.get<K9Format[]>(ApiEndpointInnsyn.sak);
        const saker: Sak[] = [];

        let harUgyldigSak;
        data.forEach((sak) => {
            const erGyldig = isK9Format(sak);
            if (erGyldig) {
                saker.push(parseK9Format(sak));
            } else {
                harUgyldigSak = true;
            }
        });
        if (harUgyldigSak === true) {
            return Promise.reject(failure('Ugyldig k9 format'));
        }
        return Promise.resolve(success(saker));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSakerRemoteData;
