import { ISODate, ISODateRange, ISODuration } from '../types';

export type TilsynsordningPerioderK9 = {
    [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export type ArbeidstidInfoK9 = {
    [key: ISODateRange]: {
        jobberNormaltTimerPerDag: ISODuration;
        faktiskArbeidTimerPerDag: ISODuration;
    };
};

export interface ArbeidsgiverK9 {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: {
        perioder: ArbeidstidInfoK9;
    };
}

export interface K9SakRemote {
    søknadId: string;
    versjon: string;
    mottattDato: string;
    søker: {
        norskIdentitetsnummer: string;
    };
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: ISODate;
        };
        søknadsperiode: ISODateRange[];
        tilsynsordning: {
            perioder: TilsynsordningPerioderK9;
        };
        arbeidstid: {
            arbeidstakerList: ArbeidsgiverK9[];
        };
    };
}
