import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';

export type TidPerDagValidator = (dag: string) => (tid: Time) => ValidationError | undefined;
