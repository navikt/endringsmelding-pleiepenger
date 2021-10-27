import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagerIPeriode } from '../components/tid-uker-input/utils';
import { getYearMonthKey } from './k9SakUtils';

export const getUtilgjengeligeDatoerIMåned = (
    utilgjengeligeDatoer: Date[],
    måned: DateRange,
    endringsperiode: DateRange
): Date[] => {
    const yearMonthKey = getYearMonthKey(måned.from);
    const dagerFørFørsteDag = dayjs(måned.from).isSame(endringsperiode.from, 'month')
        ? getDagerIPeriode(
              dayjs.min(dayjs(endringsperiode.from), dayjs(måned.from)).toDate(),
              dayjs(endringsperiode.from).subtract(1, 'day').toDate()
          ).map((d) => d.dato)
        : [];

    const dagerEtterSisteDag = dayjs(måned.from).isSame(endringsperiode.to, 'month')
        ? getDagerIPeriode(dayjs(endringsperiode.to).add(1, 'day').toDate(), måned.to).map((d) => d.dato)
        : [];

    return [
        ...dagerFørFørsteDag,
        ...utilgjengeligeDatoer.filter((d) => getYearMonthKey(d) === yearMonthKey),
        ...dagerEtterSisteDag,
    ];
};
