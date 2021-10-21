import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidEnkeltdag, TidEnkeltdag } from './SoknadFormData';

interface ArbeidsgiverArbeidstid {
    orgnr: string;
    arbeidstid: ArbeidstidEnkeltdag;
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
        arbeidstid: {
            arbeidsgivere?: ArbeidsgiverArbeidstid[];
        };
    };
}
