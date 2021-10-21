import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { iso8601DurationToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import { uniq } from 'lodash';
import { ISODate, ISODateRange, ISODuration } from '../types';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(minMax);

export const getMonthsInDateRange = (range: DateRange): DateRange[] => {
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

export const getWeeksInDateRange = (range: DateRange): DateRange[] => {
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

export const erUkeFørSammeEllerEtterDenneUken = (week: DateRange): 'før' | 'samme' | 'etter' | undefined => {
    if (dayjs(week.from).isAfter(dateToday, 'day')) {
        return 'etter';
    }
    if (dayjs(week.to).isBefore(dateToday, 'day')) {
        return 'før';
    }
    if (dayjs(dateToday).isBetween(week.from, week.to, 'day', '[]')) {
        return 'samme';
    }
    return undefined;
};

export const ISODateToDate = (isoDate: ISODate): Date => {
    return apiStringDateToDate(isoDate);
};

export const ISODateRangeToDateRange = (isoDateRange: ISODateRange): DateRange => {
    const parts = isoDateRange.split('/');
    return {
        from: apiStringDateToDate(parts[0]),
        to: apiStringDateToDate(parts[1]),
    };
};

const dateToISODate = (date: Date): ISODate => dayjs(date).format('YYYY-MM-DD');

export const ISODurationToTime = (duration: ISODuration): Time | undefined => {
    const time = iso8601DurationToTime(duration);
    return {
        hours: time?.hours ? `${time?.hours}` : '0',
        minutes: time?.minutes ? `${time?.minutes}` : '0',
    };
};

export const getISODatesInISODateRange = (range: ISODateRange): ISODate[] => {
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

export const timeHasSameDuration = (time1?: Partial<Time>, time2?: Partial<Time>): boolean => {
    if (time1 === undefined && time2 === undefined) {
        return true;
    }
    if (time1 === undefined || time2 === undefined) {
        return false;
    }
    const endretTid = timeToIso8601Duration(time1);
    const opprinneligTid = timeToIso8601Duration(time2);
    return endretTid === opprinneligTid;
};

export const isDateInDates = (date: Date, dates?: Date[]): boolean => {
    if (!dates) {
        return false;
    }
    return dates.some((d) => dayjs(date).isSame(d, 'day'));
};

export const dateIsWeekDay = (date: Date): boolean => {
    return dayjs(date).isoWeekday() <= 5;
};

export const getYearsInDateRanges = (dateRanges: DateRange[]): number[] =>
    uniq(dateRanges.map((d) => d.from.getFullYear()));
