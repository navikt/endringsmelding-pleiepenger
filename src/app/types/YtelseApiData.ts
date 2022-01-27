import { ISODate, ISODateRange, ISODuration } from '@navikt/sif-common-utils/lib';

export type TilsynsordningApiData = {
    perioder: { [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration } };
};

export type ArbeidstidEnkeltdagApiData = {
    jobberNormaltTimerPerDag: ISODuration | undefined;
    faktiskArbeidTimerPerDag: ISODuration | undefined;
};

export type ArbeidstidDagKApiData = {
    [key: ISODateRange]: ArbeidstidEnkeltdagApiData;
};

export interface ArbeidstakerApiData {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: {
        perioder: ArbeidstidDagKApiData;
    };
}
export interface ArbeidstidApiData {
    arbeidstakerList: ArbeidstakerApiData[];
    frilanserArbeidstidInfo?: {
        perioder: ArbeidstidDagKApiData;
    };
    selvstendigNæringsdrivendeArbeidstidInfo?: {
        perioder: ArbeidstidDagKApiData;
    };
}

export interface YtelseApiData {
    type: 'PLEIEPENGER_SYKT_BARN';
    tilsynsordning?: TilsynsordningApiData;
    arbeidstid?: ArbeidstidApiData;
    barn: BarnApiData;
    // søknadsperiode: ISODateRange[];
}

export interface BarnApiData {
    fødselsdato?: ISODate;
    norskIdentitetsnummer: string;
}
