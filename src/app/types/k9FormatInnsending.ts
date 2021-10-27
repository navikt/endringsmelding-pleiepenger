import { ISODateRange, ISODuration } from '.';

export type TilsynsordningK9FormatInnsending = {
    perioder: { [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration } };
};

export type ArbeidstidEnkeltdagK9FormatInnsending = {
    jobberNormaltTimerPerDag: ISODuration | undefined;
    faktiskArbeidTimerPerDag: ISODuration | undefined;
};

export type ArbeidstidDagK9FormatInnsending = {
    [key: ISODateRange]: ArbeidstidEnkeltdagK9FormatInnsending;
};

export interface ArbeidsgiverK9FormatInnsending {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: {
        perioder: ArbeidstidDagK9FormatInnsending;
    };
}
export interface ArbeidstidK9FormatInnsending {
    arbeidstakerList: ArbeidsgiverK9FormatInnsending[];
}

export interface K9FormatYtelseInnsending {
    type: 'PLEIEPENGER_SYKT_BARN';
    tilsynsordning?: TilsynsordningK9FormatInnsending;
    arbeidstid?: ArbeidstidK9FormatInnsending;
}

export interface K9FormatInnsending {
    søknadId: string;
    versjon: string;
    mottattDato: string;
    søker: {
        norskIdentitetsnummer: string;
    };
    ytelse: K9FormatYtelseInnsending;
}
