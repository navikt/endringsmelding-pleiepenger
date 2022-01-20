// import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
// import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
// import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
// import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
// import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
// import minMax from 'dayjs/plugin/minMax';
// import { DagMedTid, DateDurationMap, TidFasteDager } from '../types/SoknadFormData';
// import { dateIsWithinDateRange, ISODateToDate, timeHasSameDuration } from './dateUtils';
// import { timeToISODuration } from './timeUtils';
// import moize from 'moize';
// import { InputTime } from '@navikt/sif-common-formik/lib';

// import { DateRange } from '@navikt/sif-common-formik/lib';
// import { DateDurationMap, isDateInDateRange, ISODateToDate } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
// import { DagMedTid } from '../types/SoknadFormData';
import moize from 'moize';

dayjs.extend(isBetween);
// dayjs.extend(isSameOrAfter);

// export const MIN_ANTALL_DAGER_FOR_FAST_PLAN = 20;

// const isValidNumberString = (value: any): boolean =>
//     hasValue(value) && typeof value === 'string' && value.trim().length > 0;

// /**
//  * Fjerner dager med ugyldige verdier
//  */
// export const getValidEnkeltdager = (tidEnkeltdag: DateDurationMap): DateDurationMap => {
//     const cleanedTidEnkeltdag: DateDurationMap = {};
//     Object.keys(tidEnkeltdag).forEach((key) => {
//         const tid = tidEnkeltdag[key];
//         if (isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
//             cleanedTidEnkeltdag[key] = tid;
//         }
//     });
//     return cleanedTidEnkeltdag;
// };

// export const getValidTidEnkeltdag = ({ hours, minutes }: InputTime): InputTime => {
//     return {
//         hours: hours ? (parseInt(hours, 10) > 0 ? hours : '0') : '0',
//         minutes: minutes ? (parseInt(minutes, 10) > 0 ? minutes : '0') : '0',
//     };
// };

// export const sumTimerEnkeltdager = (dager: DateDurationMap): number => {
//     return Object.keys(dager).reduce((timer: number, key: string) => {
//         return (
//             timer +
//             timeToDecimalTime({
//                 hours: dager[key].hours || '0',
//                 minutes: dager[key].minutes || '0',
//             })
//         );
//     }, 0);
// };

// export const sumTimerFasteDager = (uke: TidFasteDager): number => {
//     return Object.keys(uke).reduce((timer: number, key: string) => {
//         return timer + timeToDecimalTime(uke[key]);
//     }, 0);
// };

// export const mapTidEnkeltdagToDagMedTid = (tidEnkeltdag: DateDurationMap): DagMedTid[] => {
//     const dager: DagMedTid[] = [];
//     Object.keys(tidEnkeltdag).forEach((key) => {
//         const dato = ISODateToDate(key);
//         if (dato) {
//             dager.push({
//                 dato,
//                 tid: tidEnkeltdag[key],
//             });
//         }
//     });
//     return dager;
// };

// export const getTidEnkeltdagerInnenforPeriode = (dager: DateDurationMap, periode: DateRange): DateDurationMap => {
//     const dagerIPerioden: DateDurationMap = {};
//     Object.keys(dager).forEach((dag) => {
//         const dato = ISODateToDate(dag);
//         if (dato && dayjs(dato).isBetween(periode.from, periode.to, 'day', '[]')) {
//             dagerIPerioden[dag] = dager[dag];
//         }
//     });
//     return dagerIPerioden;
// };

// export const _getDagerMedTidITidsrom = (data: DateDurationMap, tidsrom: DateRange): DagMedTid[] => {
//     const dager: DagMedTid[] = [];
//     Object.keys(data || {}).forEach((isoDateString) => {
//         const date = ISODateToDate(isoDateString);
//         if (date && isDateInDateRange(date, tidsrom)) {
//             const time = data[isoDateString];
//             if (time) {
//                 dager.push({
//                     dato: date,
//                     tid: time,
//                 });
//             }
//         }
//         return false;
//     });
//     return dager;
// };
// export const getDagerMedTidITidsrom = moize(_getDagerMedTidITidsrom);

// export const fjernDagerMedUendretTid = (enkeltdager: DateDurationMap, dagerOpprinnelig: DateDurationMap): DateDurationMap => {
//     const dagerMedEndring: DateDurationMap = {};
//     Object.keys(enkeltdager).forEach((isoDate) => {
//         if (timeHasSameDuration(enkeltdager[isoDate], dagerOpprinnelig[isoDate])) {
//             return;
//         }
//         dagerMedEndring[isoDate] = enkeltdager[isoDate];
//     });
//     return dagerMedEndring;
// };

// export const _tidErIngenTid = (time: InputTime): boolean => {
//     return timeToISODuration(time) === 'PT0H0M';
// };
// export const tidErIngenTid = moize(_tidErIngenTid);

export const _datoErHistorisk = (date: Date, today: Date) => dayjs(date).isBefore(today, 'day');
export const datoErHistorisk = moize(_datoErHistorisk);
