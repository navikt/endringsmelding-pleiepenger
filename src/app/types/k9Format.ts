import { ISODate, ISODateRange, ISODuration } from '.';

export type TilsynsordningPerioderK9Format = {
    [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export type ArbeidstidEnkeltdagK9Format = {
    jobberNormaltTimerPerDag: ISODuration;
    faktiskArbeidTimerPerDag: ISODuration;
};

export type ArbeidstidDagK9Format = {
    [key: ISODateRange]: ArbeidstidEnkeltdagK9Format;
};

export interface ArbeidsgiverK9Format {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: {
        perioder: ArbeidstidDagK9Format;
    };
}
export interface ArbeidstidK9Format {
    arbeidstakerList: ArbeidsgiverK9Format[];
}

export interface K9FormatYtelse {
    type: 'PLEIEPENGER_SYKT_BARN';
    barn: {
        norskIdentitetsnummer: string;
        fødselsdato: ISODate;
    };
    søknadsperiode: ISODateRange[];
    tilsynsordning: {
        perioder: TilsynsordningPerioderK9Format;
    };
    arbeidstid: ArbeidstidK9Format;
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
