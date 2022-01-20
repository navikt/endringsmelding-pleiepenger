import { isObject, isString } from 'formik';
import { SøkerRemoteData } from '../api/getSøkerRemoteData';
import { isStringOrNull } from '../utils/typeGuardUtilities';

export interface Søker {
    etternavn: string;
    fornavn: string;
    mellomnavn?: string;
    kjønn: string;
    fødselsnummer: string;
}

export const isSøkerRemoteData = (søkerRemoteData: any): søkerRemoteData is SøkerRemoteData => {
    if (
        isObject(søkerRemoteData) &&
        isString(søkerRemoteData.aktørId) &&
        isString(søkerRemoteData.fødselsdato) &&
        isString(søkerRemoteData.fødselsnummer) &&
        isStringOrNull(søkerRemoteData.fornavn) &&
        isStringOrNull(søkerRemoteData.mellomnavn) &&
        isStringOrNull(søkerRemoteData.etternavn)
    ) {
        return true;
    } else {
        return false;
    }
};
