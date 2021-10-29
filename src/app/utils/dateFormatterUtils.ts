import { prettifyDate, prettifyDateExtended, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { memoize } from 'lodash';

export const _formatDefault = memoize((date: Date) => {
    return prettifyDate(date);
});
export const _formatExtended = memoize((date: Date) => {
    return prettifyDateExtended(date);
});
export const _formatFull = memoize((date: Date) => {
    return prettifyDateFull(date);
});
export const _dateDayAndMonth = memoize((date) => dayjs(date).format('dddd DD. MMM'));

const dateFormatter = {
    short: _formatDefault,
    extended: _formatExtended,
    full: _formatFull,
    dayDateAndMonth: _dateDayAndMonth,
};

export default dateFormatter;
