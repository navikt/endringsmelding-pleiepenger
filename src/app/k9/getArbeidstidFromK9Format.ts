import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { K9ArbeidsgiverArbeidstid } from '../types/K9Sak';
import {
    dateIsWithinDateRange,
    getISODatesInISODateRangeWeekendExcluded,
    ISODateToDate,
    ISODurationToTime,
} from '../utils/dateUtils';
import { ArbeidstidInfoK9 } from './k9SakRemote';

export const getArbeidsgiverArbeidstidFromK9Format = (
    data: ArbeidstidInfoK9,
    maxRange?: DateRange
): K9ArbeidsgiverArbeidstid => {
    const arbeidstid: K9ArbeidsgiverArbeidstid = {
        faktisk: {},
        normalt: {},
    };

    const getTid = (tid: Time | undefined): Time => {
        return {
            hours: tid?.hours || '0',
            minutes: tid?.minutes || '0',
        };
    };
    Object.keys(data).forEach((isoDateRange) => {
        const isoDates = getISODatesInISODateRangeWeekendExcluded(isoDateRange);
        isoDates.forEach((isoDate) => {
            if (maxRange === undefined || dateIsWithinDateRange(ISODateToDate(isoDate), maxRange)) {
                arbeidstid.faktisk[isoDate] = getTid(ISODurationToTime(data[isoDateRange].faktiskArbeidTimerPerDag));
                arbeidstid.normalt[isoDate] = getTid(ISODurationToTime(data[isoDateRange].jobberNormaltTimerPerDag));
            }
        });
    });

    return arbeidstid;
};
