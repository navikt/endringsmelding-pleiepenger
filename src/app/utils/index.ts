import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const getSøknadsdato = (): Date => new Date();

export const getEndringsperiode = (søknadsdato: Date): DateRange => ({
    from: dayjs(søknadsdato).subtract(3, 'months').startOf('day').toDate(),
    to: dayjs(søknadsdato).add(12, 'months').endOf('day').toDate(),
});
