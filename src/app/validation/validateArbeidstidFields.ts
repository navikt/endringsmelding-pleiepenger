import { InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { TidPerDagValidator } from './fieldValidations';

export const getArbeidstidValidator: TidPerDagValidator = (dag: string) => (tid: InputTime) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 24, minutes: 59 },
    })(tid);
    // Todo - fikse 24 timer og 0 minutter validering
    return error
        ? {
              key: `arbeidstid.validation.${error}`,
              values: {
                  dag,
                  maksTimer: '7 timer og 30 minutter',
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};
