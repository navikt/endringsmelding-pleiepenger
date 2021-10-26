import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagerIPeriode } from '../components/tid-uker-input/utils';
import { getYearMonthKey } from './k9utils';

export const getUtilgjengeligeDatoerIMåned = (
    utilgjengeligeDatoer: Date[],
    måned: DateRange,
    endringsperiode: DateRange
): Date[] => {
    const yearMonthKey = getYearMonthKey(måned.from);
    const dagerFørFørsteDag = dayjs(måned.from).isSame(endringsperiode.from, 'month')
        ? getDagerIPeriode(måned.from, dayjs(endringsperiode.from).subtract(1, 'day').toDate()).map((d) => d.dato)
        : [];

    const dagerEtterSisteDag = dayjs(måned.from).isSame(endringsperiode.to, 'month')
        ? getDagerIPeriode(dayjs(måned.to).add(1, 'day').toDate(), endringsperiode.to).map((d) => d.dato)
        : [];

    return [
        ...dagerFørFørsteDag,
        ...utilgjengeligeDatoer.filter((d) => getYearMonthKey(d) === yearMonthKey),
        ...dagerEtterSisteDag,
    ];
};
