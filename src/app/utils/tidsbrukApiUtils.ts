import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    DateDurationMap,
    dateToISODate,
    durationToISODuration,
    isDateInDateRange,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { TidEnkeltdagApiData } from '../types/SoknadApiData';

const sortTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getTidEnkeltdagApiDataIPeriodeApiData = (
    enkeltdager: DateDurationMap,
    periode: DateRange
): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    if (enkeltdager === undefined) {
        return [];
    }

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISODateToDate(dag);
        if (dato && isDateInDateRange(dato, periode)) {
            dager.push({
                dato: dateToISODate(dato),
                tid: durationToISODuration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortTidEnkeltdagApiData);
};
