import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import minMax from 'dayjs/plugin/minMax';
import { ISODate, ISODateRange, ISODuration } from '../types';
import isoWeek from 'dayjs/plugin/isoWeek';

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

export const getMinMaxInDateRanges = (ranges: DateRange[]): DateRange => {
    return {
        from: dayjs.min(ranges.map((range) => dayjs(range.from))).toDate(),
        to: dayjs.max(ranges.map((range) => dayjs(range.to))).toDate(),
    };
};
