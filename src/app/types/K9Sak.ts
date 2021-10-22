import { DateRange } from '@navikt/sif-common-formik/lib';
import { DagerIkkeSøktFor } from '.';
import { TidEnkeltdag } from './SoknadFormData';

export type K9ArbeidsgiverArbeidstid = { faktisk: TidEnkeltdag; normalt: TidEnkeltdag };

export type K9ArbeidsgivereArbeidstid = {
    [orgnr: string]: K9ArbeidsgiverArbeidstid;
};

export interface K9Arbeidstid {
    arbeidsgivere: K9ArbeidsgivereArbeidstid;
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
    meta: {
        dagerIkkeSøktFor: DagerIkkeSøktFor;
    };
}
