import { ISO8601DateRange, ISO8601Duration, ISO8601Date } from './';

export const isISO8601Date = (value: any): value is ISO8601Date => {
    if (value && typeof value === 'string') {
        const reg = /^\d{4}-\d{2}-\d{2}$/;
        const match: RegExpMatchArray | null = value.match(reg);
        return match !== null;
    } else {
        return false;
    }
};

export const isISO8601DateRange = (value: any): value is ISO8601DateRange => {
    if (value && typeof value === 'string') {
        const dates = value.split('/');
        if (dates.length !== 2) {
            return false;
        }
        return isISO8601Date(dates[0]) === true && isISO8601Date(dates[1]) === true;
    } else {
        return false;
    }
};

export const isISO8601Duration = (value: any): value is ISO8601Duration => {
    /** Only hours and minutes PT7H30M */
    if (value && typeof value === 'string') {
        if (value === 'PT') {
            return false;
        }
        const reg = /^PT(\d{1,2}H)?(\d{1,2}M)?$/;
        const match: RegExpMatchArray | null = value.match(reg);
        return match !== null;
    } else {
        return false;
    }
};
