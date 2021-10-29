import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import { uniq, memoize } from 'lodash';
import { InputTime, ISODate, ISODateRange, ISODuration } from '../types';
import { isoDurationToTime, timeToISODuration } from './timeUtils';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

export const _getMonthsInDateRange = (range: DateRange): DateRange[] => {
    const months: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        months.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to, 'day') ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to, 'day'));
    return months;
};
export const getMonthsInDateRange = memoize(_getMonthsInDateRange);

export const _getWeeksInDateRange = (range: DateRange): DateRange[] => {
    const weeks: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('week').toDate() };
        weeks.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to, 'day') ? range.to : monthRange.to,
        });
        current = current.add(1, 'week').startOf('week');
    } while (current.isBefore(range.to, 'day'));
    return weeks;
};
export const getWeeksInDateRange = memoize(_getWeeksInDateRange);

export const getDatesInDateRange = (range: DateRange, onlyWeekDays = true): Date[] => {
    const dates: Date[] = [];
    let current = dayjs(range.from); //.subtract(dayjs(range.from).isoWeekday() - 1, 'days');
    do {
        const date = current.toDate();
        if (onlyWeekDays === false || dateIsWeekDay(date)) {
            dates.push(date);
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(range.to, 'day'));
    return dates;
};

export const getDatesInMonth = (month: Date, onlyWeekDays = true): Date[] => {
    const dates: Date[] = [];
    const range = getMonthDateRange(month);
    let current = dayjs(range.from); //.subtract(dayjs(range.from).isoWeekday() - 1, 'days');
    do {
        const date = current.toDate();
        if (onlyWeekDays === false || dateIsWeekDay(date)) {
            dates.push(date);
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(range.to, 'day'));
    return dates;
};

export const getFirstDateOfWeek = (dateInWeek: Date): Date =>
    dayjs(dateInWeek)
        .subtract(dayjs(dateInWeek).isoWeekday() - 1, 'days')
        .toDate();

export const getMonthDateRange = (date: Date): DateRange => ({
    from: dayjs(date).startOf('month').toDate(),
    to: dayjs(date).endOf('month').toDate(),
});

export const _ISODateToDate = (isoDate: ISODate): Date => {
    return apiStringDateToDate(isoDate);
};
export const ISODateToDate = memoize(_ISODateToDate);

export const ISODateRangeToDateRange = (isoDateRange: ISODateRange): DateRange => {
    const parts = isoDateRange.split('/');
    return {
        from: ISODateToDate(parts[0]),
        to: ISODateToDate(parts[1]),
    };
};

export const dateRangeToISODateRange = (dateRange: DateRange): ISODateRange => {
    return `${dateToISODate(dateRange.from)}/${dateToISODate(dateRange.to)}`;
};

export const _dateToISODate = (date: Date): ISODate => dayjs(date).format('YYYY-MM-DD');
export const dateToISODate = memoize(_dateToISODate);

export const ISODurationToTime = (duration: ISODuration): Time | undefined => {
    const time = isoDurationToTime(duration);
    return {
        hours: time?.hours ? `${time?.hours}` : '0',
        minutes: time?.minutes ? `${time?.minutes}` : '0',
    };
};

export const getISODatesInISODateRangeWeekendExcluded = (range: ISODateRange): ISODate[] => {
    const dateRange = ISODateRangeToDateRange(range);
    const { from, to } = dateRange;
    let currentDate = dayjs(from);
    const dates: ISODate[] = [];
    do {
        const weekday = currentDate.isoWeekday();
        if (weekday <= 5) {
            dates.push(dateToISODate(currentDate.toDate()));
        }
        currentDate = dayjs(currentDate).add(1, 'day');
    } while (dayjs(currentDate).isSameOrBefore(to, 'day'));
    return dates;
};

export const getDateRangeFromDateRanges = (ranges: DateRange[]): DateRange => {
    return {
        from: dayjs.min(ranges.map((range) => dayjs(range.from))).toDate(),
        to: dayjs.max(ranges.map((range) => dayjs(range.to))).toDate(),
    };
};

export const _timeHasSameDuration = (time1?: InputTime, time2?: InputTime): boolean => {
    if (time1 === undefined && time2 === undefined) {
        return true;
    }
    if (time1 === undefined || time2 === undefined) {
        return false;
    }
    const endretTid = timeToISODuration(time1);
    const opprinneligTid = timeToISODuration(time2);
    return endretTid === opprinneligTid;
};
export const timeHasSameDuration = memoize(_timeHasSameDuration);

export const isDateInDates = (date: Date, dates?: Date[]): boolean => {
    if (!dates) {
        return false;
    }
    return dates.some((d) => dayjs(date).isSame(d, 'day'));
};

/** Includes start and end date */
export const _dateIsWithinDateRange = (date: Date, dateRange: DateRange): boolean => {
    return dayjs(date).isBetween(dateRange.from, dateRange.to, 'day', '[]');
};
export const dateIsWithinDateRange = memoize(_dateIsWithinDateRange);

export const dateIsWeekDay = (date: Date): boolean => {
    return dayjs(date).isoWeekday() <= 5;
};

export const getYearsInDateRanges = (dateRanges: DateRange[]): number[] =>
    uniq(dateRanges.map((d) => d.from.getFullYear()));

export const getDateRangesBetweenDateRanges = (dateRanges: DateRange[]): DateRange[] => {
    const rangesInBetween: DateRange[] = [];
    dateRanges.forEach((periode, index) => {
        if (index === 0) {
            return;
        }
        const rangeInBetween: DateRange = {
            from: dayjs(dateRanges[index - 1].to)
                .add(1, 'day')
                .toDate(),
            to: dayjs(periode.from).subtract(1, 'day').toDate(),
        };

        if (dayjs(rangeInBetween.from).isSameOrBefore(rangeInBetween.to, 'day')) {
            rangesInBetween.push(rangeInBetween);
        }
    });
    return rangesInBetween;
};
