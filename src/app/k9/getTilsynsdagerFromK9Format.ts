import { TidEnkeltdag } from '../types/SoknadFormData';
import { getISODatesInISODateRangeWeekendExcluded, ISODurationToTime } from '../utils/dateUtils';
import { TilsynsordningPerioderK9 } from './k9SakRemote';

export const getTilsynsdagerFromK9Format = (data: TilsynsordningPerioderK9): TidEnkeltdag => {
    const enkeltdager: TidEnkeltdag = {};

    Object.keys(data).forEach((isoDateRange) => {
        const duration = data[isoDateRange].etablertTilsynTimerPerDag;
        const time = ISODurationToTime(duration);
        const isoDates = getISODatesInISODateRangeWeekendExcluded(isoDateRange);

        isoDates.forEach((isoDate) => {
            enkeltdager[isoDate] = { hours: time?.hours, minutes: time?.minutes };
        });
    });
    return enkeltdager;
};
