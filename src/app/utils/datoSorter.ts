import dayjs from 'dayjs';

export const datoSorter = (d1: { dato: Date }, d2: { dato: Date }): number =>
    dayjs(d1.dato).isSameOrBefore(d2.dato, 'day') ? -1 : 1;
