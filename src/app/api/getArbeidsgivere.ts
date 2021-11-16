import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ISODate } from '../types';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9FormatArbeidsgiver } from '../types/k9Format';
import { ISODateToDate } from '../utils/dateUtils';
import api from './api';

type AAregArbeidsgiver = {
    organisasjoner: {
        organisasjonsnummer: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
};

interface OrganisasjonResponseType {
    [organisasjonsnummer: string]: string;
}

export type ArbeidsgiverRemoteData = RemoteData<AxiosError, Arbeidsgiver[]>;

const getArbeidsgivereIkkeRegistrertiAaReg = (
    k9arbeidstakere: K9FormatArbeidsgiver[],
    arbeidsgivereAaReg: Arbeidsgiver[]
): K9FormatArbeidsgiver[] => {
    return k9arbeidstakere.filter(
        (k9a) => arbeidsgivereAaReg.find((a) => a.organisasjonsnummer === k9a.organisasjonsnummer) === undefined
    );
};

/** Når K9 har informasjon om en arbeidsgiver som ikke enda er
 * registrert i aa-reg, hentes navn på organisasjon fra
 * enhetsregisteret */

const getOrganisasjonerSomArbeidsgivere = async (
    k9arbeidsgivere: K9FormatArbeidsgiver[],
    aaArbeidsgivere: Arbeidsgiver[]
) => {
    const arbeidstakereIkkeIAaReg = getArbeidsgivereIkkeRegistrertiAaReg(k9arbeidsgivere, aaArbeidsgivere).map(
        (a) => a.organisasjonsnummer
    );

    const { data } = await api.psb.get<OrganisasjonResponseType>(
        ApiEndpointPsb.organisasjoner,
        `?${arbeidstakereIkkeIAaReg.join('&orgnr=')}`
    );
    return Object.keys(data).map(
        (organisasjonsnummer): Arbeidsgiver => ({
            organisasjonsnummer,
            navn: data[organisasjonsnummer],
            erUkjentIAareg: true,
        })
    );
};

const getArbeidsgivereRemoteData = async (
    fom: string,
    tom: string,
    k9arbeidsgivere: K9FormatArbeidsgiver[]
): Promise<ArbeidsgiverRemoteData> => {
    try {
        const { data } = await api.psb.get<AAregArbeidsgiver>(
            ApiEndpointPsb.arbeidsgiver,
            `fra_og_med=${fom}&til_og_med=${tom}`
        );

        const aaArbeidsgivere: Arbeidsgiver[] = data.organisasjoner.map(
            (a): Arbeidsgiver => ({
                ...a,
                ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
                ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
            })
        );

        const kunK9rbeidsgivere = await getOrganisasjonerSomArbeidsgivere(k9arbeidsgivere, aaArbeidsgivere);

        return Promise.resolve(success([...aaArbeidsgivere, ...kunK9rbeidsgivere]));

        // const mockResult: Arbeidsgiver[] = [
        //     // { organisasjonsnummer: '907670202', navn: 'NYE KLONELABBEN', ansattFom: ISODateToDate('2021-10-01') },
        //     {
        //         organisasjonsnummer: '967170232',
        //         navn: 'Bakeriet smått og godt',
        //         ansattFom: ISODateToDate('2008-10-01'),
        //     },
        // ];
        // return Promise.resolve(success(mockResult));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgivereRemoteData;
