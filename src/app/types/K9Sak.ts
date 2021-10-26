import { DateRange } from '@navikt/sif-common-formik/lib';
import { DagerIkkeSøktForMap, DagerSøktForMap } from '.';
import { TidEnkeltdag } from './SoknadFormData';

export type K9ArbeidsgiverArbeidstid = { faktisk: TidEnkeltdag; normalt: TidEnkeltdag };

export type K9ArbeidsgivereArbeidstidMap = {
    [orgnr: string]: K9ArbeidsgiverArbeidstid;
};

export interface K9Arbeidstid {
    arbeidsgivereMap: K9ArbeidsgivereArbeidstidMap;
}

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
        tilsynsordning: {
            enkeltdager: TidEnkeltdag;
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
    utilgjengeligeDatoerIMåned: { [månedIsoString: string]: Date[] };
}

export type MånedMedSøknadsperioderMap = {
    [yearMonthKey: string]: DateRange[];
};
