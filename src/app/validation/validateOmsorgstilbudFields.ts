import { InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { TidPerDagValidator } from './fieldValidations';

export const getTidIOmsorgValidator: TidPerDagValidator = (dag: string) => (tid: InputTime) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 7, minutes: 30 },
    })(tid);
    return error
        ? {
              key: `omsorgstilbud.validation.${error}`,
              values: {
                  dag,
                  maksTimer: '7 timer og 30 minutter',
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};
