import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagerIPeriode } from '../components/tid-uker-input/utils';

export const getUtilgjengeligeDagerIMåned = (utilgjengeligeDager: Date[], måned: DateRange): Date[] => {
    const dagerFørFørsteDag =
        måned.from.getDate() !== måned.from.getDate()
            ? getDagerIPeriode(måned.from, dayjs(måned.from).subtract(1, 'day').toDate()).map((d) => d.dato)
            : [];

    const dagerEtterSisteDag =
        måned.to.getDate() !== måned.to.getDate()
            ? getDagerIPeriode(dayjs(måned.to).add(1, 'day').toDate(), måned.to).map((d) => d.dato)
            : [];

    return [...dagerFørFørsteDag, ...utilgjengeligeDager, ...dagerEtterSisteDag];
};
