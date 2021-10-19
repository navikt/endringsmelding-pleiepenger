import { DateRange } from '@navikt/sif-common-formik/lib';
import { TidEnkeltdag } from './SoknadFormData';

export interface K9Sak {
    søknadId: string;
    søker: string;
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: Date;
        };
        søknadsperiode: DateRange[];
        tilsynsordning: {
            enkeltdager: TidEnkeltdag;
        };
    };
}
