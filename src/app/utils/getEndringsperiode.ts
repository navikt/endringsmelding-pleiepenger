import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export const getEndringsdato = (): Date => new Date();

export const getEndringsperiode = (endringsdato: Date, søknadsoperiode: DateRange): DateRange => {
    const endringsperiode: DateRange = {
        from: dayjs(endringsdato).subtract(3, 'months').startOf('day').toDate(),
        to: dayjs(endringsdato).add(12, 'months').endOf('day').toDate(),
    };

    return {
        from: dayjs.max(dayjs(søknadsoperiode.from), dayjs(endringsperiode.from)).toDate(),
        to: dayjs.min(dayjs(søknadsoperiode.to), dayjs(endringsperiode.to)).toDate(),
    };
};
