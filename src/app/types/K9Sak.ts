import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import { DagerIkkeSøktForMap, DagerSøktForMap } from '.';
import { K9FormatArbeidsgiver, K9OpptjeningAktivitetFrilanser } from './k9Format';

export type K9TidEnkeltdag = { [isoDateString: string]: InputTime };

export type K9ArbeidstidInfo = {
    faktisk: K9TidEnkeltdag;
    normalt: K9TidEnkeltdag;
};

export type K9ArbeidstakerMap = {
    [orgnr: string]: K9ArbeidstidInfo;
};

export interface K9Arbeidstid {
    arbeidstakerMap?: K9ArbeidstakerMap;
    frilanser?: K9ArbeidstidInfo;
    selvstendig?: K9ArbeidstidInfo;
}

export interface K9SakMedMeta {
    sak: K9Sak;
    meta: K9SakMeta;
}

/** Eget versjon av K9Format som forenkler uthenting av informasjon i endringsdialogen */
export interface K9Sak {
    søknadId: string;
    søker: {
        norskIdentitetsnummer: string;
    };
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: Date;
        };
        søknadsperioder: DateRange[];
        opptjeningAktivitet: {
            arbeidstaker: K9FormatArbeidsgiver[];
            frilanser?: K9OpptjeningAktivitetFrilanser;
        };
        tilsynsordning: {
            enkeltdager: K9TidEnkeltdag;
        };
        arbeidstid: K9Arbeidstid;
    };
}

export interface K9SakMeta {
    /** Dato endring gjennomføres på (dagens dato) */
    endringsdato: Date;

    /** Hele perioden som bruker kan gjøre endringer innenfor, avgrenset til 3 måned bakover og 12 måneder
     * fremover i tid. Avkortet dersom søknadsperioder er kortere.
     */
    endringsperiode: DateRange;

    /** Dager det er søkt for */
    dagerSøktForMap: DagerSøktForMap;

    /** Dager det ikke er søkt for */
    dagerIkkeSøktForMap: DagerIkkeSøktForMap;

    /** Søknadsperioder */
    søknadsperioder: DateRange[];

    /** Måneder som har dager det er søkt om */
    alleMånederISøknadsperiode: DateRange[];

    /** Måneder som har dager det er søkt om */
    månederMedSøknadsperiodeMap: MånedMedSøknadsperioderMap;

    /** Antall måneder som ikke har dager det er søkt for */
    antallMånederUtenSøknadsperiode: number;

    /** Flagg dersom månedene går over flere år */
    søknadsperioderGårOverFlereÅr: boolean;

    /** Utilgjengelige datoer */
    utilgjengeligeDatoer: Date[];

    /** Utilgjengelige datoer per måned */
    utilgjengeligeDatoerIMånedMap: { [månedIsoString: string]: Date[] };
}

export type MånedMedSøknadsperioderMap = {
    [yearMonthKey: string]: DateRange[];
};
