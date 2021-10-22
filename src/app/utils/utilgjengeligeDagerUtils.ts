import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagerIPeriode } from '../components/tid-uker-input/utils';
import { DagerIkkeSøktFor } from '../types';
import { dateIsWeekDay, getDatesInDateRange, getMonthDateRange, ISODateToDate } from '../utils/dateUtils';

export const getUtilgjengeligeDagerIMåned = (utilgjengeligeDager: Date[], måned: DateRange): Date[] => {
    const heleMåned = getMonthDateRange(måned.from);
    const dagerFørFørsteDag =
        måned.from.getDate() !== heleMåned.from.getDate()
            ? getDagerIPeriode(heleMåned.from, dayjs(måned.from).subtract(1, 'day').toDate()).map((d) => d.dato)
            : [];

    const dagerEtterSisteDag =
        måned.to.getDate() !== heleMåned.to.getDate()
            ? getDagerIPeriode(dayjs(måned.to).add(1, 'day').toDate(), heleMåned.to).map((d) => d.dato)
            : [];

    return [...dagerFørFørsteDag, ...utilgjengeligeDager, ...dagerEtterSisteDag];
};

export const getUtilgjengeligeDager = (perioder: DateRange[], dagerIkkeSøktFor?: DagerIkkeSøktFor): Date[] => {
    if (perioder.length === 1) {
        return [];
    }
    const utilgjengeligeDager: Date[] = Object.keys(dagerIkkeSøktFor || []).map((key) => ISODateToDate(key));

    perioder.forEach((periode, index) => {
        if (index === 0) {
            return;
        }
        const forrigePeriode = perioder[index - 1];
        const dagerMellom = dayjs(periode.from).diff(forrigePeriode.to, 'days');
        if (dagerMellom > 0) {
            const dates = getDatesInDateRange({
                from: dayjs(forrigePeriode.to).add(1, 'day').toDate(),
                to: dayjs(periode.from).subtract(1, 'day').toDate(),
            }).filter(dateIsWeekDay);
            utilgjengeligeDager.push(...dates);
        }
    });
    return utilgjengeligeDager;
};
