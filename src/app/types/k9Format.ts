import { ISODateString } from 'nav-datovelger/lib/types';
import { ISODate, ISODateRange, ISODuration } from '.';

export type K9FormatTilsynsordningPerioder = {
    [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export type K9FormatArbeidstidTid = {
    jobberNormaltTimerPerDag: ISODuration;
    faktiskArbeidTimerPerDag: ISODuration;
};

export type K9FormatArbeidstidPeriode = {
    [key: ISODateRange]: K9FormatArbeidstidTid;
};

export interface K9FormatArbeidstidInfo {
    perioder: K9FormatArbeidstidPeriode;
}
export interface K9FormatArbeidstaker {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: K9FormatArbeidstidInfo;
}
export interface K9FormatArbeidstid {
    arbeidstakerList: K9FormatArbeidstaker[];
    frilanserArbeidstidInfo?: {
        perioder: K9FormatArbeidstidPeriode;
    };
    selvstendigNæringsdrivendeArbeidstidInfo?: {
        perioder: K9FormatArbeidstidPeriode;
    };
}

export interface K9FormatArbeidsgiverPrivat {
    norskIdentitetsnummer: string;
}

export interface K9FormatArbeidsgiverOrganisasjon {
    organisasjonsnummer: string;
}

export const isK9FormatArbeidsgiverOrganisasjon = (
    arbeidsgiver: any
): arbeidsgiver is K9FormatArbeidsgiverOrganisasjon =>
    (arbeidsgiver as K9FormatArbeidsgiverOrganisasjon).organisasjonsnummer !== undefined;

export const isK9FormatArbeidsgiverPrivat = (arbeidsgiver: any): arbeidsgiver is K9FormatArbeidsgiverPrivat =>
    (arbeidsgiver as K9FormatArbeidsgiverPrivat).norskIdentitetsnummer !== undefined;

export type K9FormatArbeidsgiver = K9FormatArbeidsgiverPrivat | K9FormatArbeidsgiverOrganisasjon;

export interface K9OpptjeningAktivitetFrilanser {
    startdato: ISODateString;
    sluttdato?: ISODateString;
    jobberFortsattSomFrilanser: boolean;
}
export interface K9FormatYtelse {
    type: 'PLEIEPENGER_SYKT_BARN';
    barn: {
        norskIdentitetsnummer: string;
        fødselsdato: ISODate;
    };
    søknadsperiode: ISODateRange[];
    opptjeningAktivitet: {
        arbeidstaker: K9FormatArbeidsgiver[];
        frilanser?: K9OpptjeningAktivitetFrilanser;
    };
    tilsynsordning: {
        perioder: K9FormatTilsynsordningPerioder;
    };
    arbeidstid: K9FormatArbeidstid;
}

export interface K9Format {
    søknadId: string;
    versjon: string;
    mottattDato: string;
    søker: {
        norskIdentitetsnummer: string;
    };
    ytelse: K9FormatYtelse;
}
