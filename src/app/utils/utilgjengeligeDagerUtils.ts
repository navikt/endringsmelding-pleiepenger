import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagerIPeriode } from '../components/tid-uker-input/utils';
import { getMonthDateRange } from '../utils/dateUtils';

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
