import { apiStringDateToDate, DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { TidEnkeltdagApiData } from '../types/SoknadApiData';
import { TidEnkeltdag } from '../types/SoknadFormData';

const sortTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdagerIPeriodeApiData = (enkeltdager: TidEnkeltdag, periode: DateRange): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    if (enkeltdager === undefined) {
        return [];
    }

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, periode)) {
            dager.push({
                dato: dateToISOString(dato),
                tid: timeToIso8601Duration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortTidEnkeltdagApiData);
};

export const fjernTidUtenforPeriode = (
    periode: Partial<DateRange>,
    tidEnkeltdag?: TidEnkeltdagApiData[]
): TidEnkeltdagApiData[] | undefined => {
    const { from, to } = periode;
    if (!tidEnkeltdag || (!from && !to)) {
        return tidEnkeltdag;
    }
    return tidEnkeltdag.filter((dag) => {
        const dato = apiStringDateToDate(dag.dato);
        if (from && dayjs(dato).isBefore(from, 'day')) {
            return false;
        }
        if (to && dayjs(dato).isAfter(to, 'day')) {
            return false;
        }
        return true;
    });
};
