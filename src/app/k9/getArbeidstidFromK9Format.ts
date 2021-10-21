import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { ArbeidstidEnkeltdag, ArbeidstidNormaltOgFaktisk } from '../types/SoknadFormData';
import {
    dateIsWithinDateRange,
    getISODatesInISODateRangeWeekendExcluded,
    ISODateToDate,
    ISODurationToTime,
} from '../utils/dateUtils';
import { ArbeidstidInfoK9 } from './k9SakRemote';

export const getArbeidstidFromK9Format = (data: ArbeidstidInfoK9, maxRange?: DateRange): ArbeidstidEnkeltdag => {
    const arbeidstidEnkeltdager: ArbeidstidEnkeltdag = {};

    const getTid = (tid: Time | undefined): Time => {
        return {
            hours: tid?.hours || '0',
            minutes: tid?.minutes || '0',
        };
    };
    Object.keys(data).forEach((isoDateRange) => {
        const isoDates = getISODatesInISODateRangeWeekendExcluded(isoDateRange);
        const arbeidstidIPeriode: ArbeidstidNormaltOgFaktisk = {
            faktiskArbeidTimer: getTid(ISODurationToTime(data[isoDateRange].faktiskArbeidTimerPerDag)),
            jobberNormaltTimer: getTid(ISODurationToTime(data[isoDateRange].jobberNormaltTimerPerDag)),
        };
        isoDates.forEach((isoDate) => {
            if (maxRange === undefined || dateIsWithinDateRange(ISODateToDate(isoDate), maxRange)) {
                arbeidstidEnkeltdager[isoDate] = arbeidstidIPeriode;
            }
        });
    });

    return arbeidstidEnkeltdager;
};
