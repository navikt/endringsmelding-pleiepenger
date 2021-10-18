import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const getEndringsdato = (): Date => new Date();

export const getEndringsperiode = (endringsdato: Date): DateRange => ({
    from: dayjs(endringsdato).subtract(3, 'months').startOf('day').toDate(),
    to: dayjs(endringsdato).add(12, 'months').endOf('day').toDate(),
});
