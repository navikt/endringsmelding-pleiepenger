import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ISODate } from '../types';
import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Arbeidsgiver, ArbeidsgiverType } from '../types/Arbeidsgiver';
import {
    isK9FormatArbeidsgiverOrganisasjon,
    K9FormatArbeidsgiver,
    K9FormatArbeidsgiverOrganisasjon,
} from '../types/k9Format';
import { ISODateToDate } from '../utils/dateUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import api from './api';

type AAregArbeidsgiver = {
    organisasjoner?: {
        organisasjonsnummer: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    privatarbeidsgiver?: {
        offentligIdent: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
};

interface OrganisasjonResponseType {
    [organisasjonsnummer: string]: string;
}

export type ArbeidsgiverRemoteData = RemoteData<AxiosError, Arbeidsgiver[]>;

const getOrganisasjonerIkkeRegistrertiAaReg = (
    k9arbeidstakere: K9FormatArbeidsgiverOrganisasjon[],
    arbeidsgivereAaReg: Arbeidsgiver[]
): K9FormatArbeidsgiver[] => {
    return k9arbeidstakere.filter(
        (k9a) => arbeidsgivereAaReg.find((a) => a.id === k9a.organisasjonsnummer) === undefined
    );
};

/** Når K9 har informasjon om en arbeidsgiver som ikke enda er
 * registrert i aa-reg, hentes navn på organisasjon fra
 * enhetsregisteret */

export const getOrganisasjonerSomArbeidsgivere = async (
    k9arbeidsgivere: K9FormatArbeidsgiver[],
    aaArbeidsgivere: Arbeidsgiver[]
) => {
    const k9ArbeidsgivereOrganisasjon: K9FormatArbeidsgiverOrganisasjon[] = k9arbeidsgivere.filter((a) =>
        isK9FormatArbeidsgiverOrganisasjon(a)
    ) as any;

    const organisasjonerIkkeIAaReg = getOrganisasjonerIkkeRegistrertiAaReg(
        k9ArbeidsgivereOrganisasjon,
        aaArbeidsgivere
    ).map((a: K9FormatArbeidsgiverOrganisasjon) => a.organisasjonsnummer);

    if (organisasjonerIkkeIAaReg.length > 0) {
        const organisasjonerParams = `orgnr=${organisasjonerIkkeIAaReg.join('&orgnr=')}`;
        const { data } = await api.psb.get<OrganisasjonResponseType>(
            ApiEndpointPsb.organisasjoner,
            organisasjonerParams
        );
        return Object.keys(data).map(
            (organisasjonsnummer): Arbeidsgiver => ({
                type: ArbeidsgiverType.ORGANISASJON,
                id: organisasjonsnummer,
                navn: data[organisasjonsnummer],
                erUkjentIAareg: true,
            })
        );
    }
    return [];
};

const getArbeidsgivereRemoteData = async (
    fom: string,
    tom: string
    // k9arbeidsgivere: K9FormatArbeidsgiver[]
): Promise<ArbeidsgiverRemoteData> => {
    if (isFeatureEnabled(Feature.FAKE_API_KALL)) {
        const mockResult: Arbeidsgiver[] = [
            {
                type: ArbeidsgiverType.ORGANISASJON,
                id: '967170232',
                navn: 'Bakeriet smått og godt',
                ansattFom: ISODateToDate('2008-10-01'),
            },
            // {
            //     type: ArbeidsgiverType.PRIVATPERSON,
            //     id: '12312312312',
            //     navn: 'Privat Personesen',
            //     ansattFom: ISODateToDate('2018-01-01'),
            // },
        ];
        return Promise.resolve(success(mockResult));
    }
    try {
        const { data } = await api.psb.get<AAregArbeidsgiver>(
            ApiEndpointPsb.arbeidsgiver,
            `fra_og_med=${fom}&til_og_med=${tom}`
        );

        const aaArbeidsgivere: Arbeidsgiver[] = [];
        (data.organisasjoner || []).map((a): Arbeidsgiver => {
            return {
                id: a.organisasjonsnummer,
                type: ArbeidsgiverType.ORGANISASJON,
                navn: a.navn,
                ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
                ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
            };
        });
        (data.privatarbeidsgiver || []).map((a): Arbeidsgiver => {
            return {
                id: a.offentligIdent,
                type: ArbeidsgiverType.ORGANISASJON,
                navn: a.navn,
                ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
                ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
            };
        });

        // const kunK9rbeidsgivere = await getOrganisasjonerSomArbeidsgivere(k9arbeidsgivere, aaArbeidsgivere);

        return Promise.resolve(success([...aaArbeidsgivere /*, ...kunK9rbeidsgivere*/]));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgivereRemoteData;
