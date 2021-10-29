import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import dayjs from 'dayjs';
import { TidEnkeltdagApiData } from '../types/SoknadApiData';
import { TidEnkeltdag } from '../types/SoknadFormData';
import { dateIsWithinDateRange, dateToISODate, ISODateToDate } from './dateUtils';

const sortTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getTidEnkeltdagApiDataIPeriodeApiData = (
    enkeltdager: TidEnkeltdag,
    periode: DateRange
): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    if (enkeltdager === undefined) {
        return [];
    }

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISODateToDate(dag);
        if (dato && dateIsWithinDateRange(dato, periode)) {
            dager.push({
                dato: dateToISODate(dato),
                tid: timeToIso8601Duration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortTidEnkeltdagApiData);
};
