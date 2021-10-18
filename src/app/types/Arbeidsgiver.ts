import { DateRange } from '@navikt/sif-common-formik/lib';

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    navn: string;
    ansattPeriode?: DateRange;
}
export type Arbeidsgivere = Arbeidsgiver[];
