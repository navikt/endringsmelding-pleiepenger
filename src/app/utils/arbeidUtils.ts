import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, Duration, isDateInDates, isValidDuration } from '@navikt/sif-common-utils';
import { ArbeidstakerMap, ArbeidstidEnkeltdagSak } from '../types/Sak';
import { ArbeidssituasjonFormValue, Arbeidssituasjon } from '../types/SoknadFormData';

export const getArbeidssituasjonFieldKeyForArbeidsgiver = (orgnr: string) => `#${orgnr}`;

export const getArbeidssituasjonForArbeidsgiver = (
    orgnr: string,
    arbeidssituasjon?: ArbeidssituasjonFormValue
): Arbeidssituasjon | undefined => {
    const fieldKey = getArbeidssituasjonFieldKeyForArbeidsgiver(orgnr);
    return arbeidssituasjon ? arbeidssituasjon?.arbeidsgiver[fieldKey] : undefined;
};

export const getArbeidstidForArbeidsgiver = (
    orgnr: string,
    arbeidstakerMap?: ArbeidstakerMap
): ArbeidstidEnkeltdagSak => {
    if (arbeidstakerMap === undefined || arbeidstakerMap[orgnr] === undefined) {
        return { faktisk: {}, normalt: {} };
    }
    return arbeidstakerMap[orgnr];
};

export const getDagerMedGyldigArbeidstidISak = (
    dagerTilgjengelig: DateDurationMap,
    dagerSak: DateDurationMap
): DateDurationMap => {
    const gyldigeDager: DateDurationMap = {};
    Object.keys(dagerTilgjengelig).forEach((isoDate) => {
        if (dagerSak[isoDate] && isValidDuration(dagerSak[isoDate])) {
            gyldigeDager[isoDate] = dagerTilgjengelig[isoDate];
        }
    });
    return gyldigeDager;
};

/** Returner datoer i dates1 som ikke er i dates2 */
export const getDatesNotInDates = (dates1: Date[], dates2: Date[]): Date[] => {
    return dates1.filter((d) => isDateInDates(d, dates2) === false);
};

export const getDagerMedIkkeGyldigArbeidstidISak = (
    dagerTilgjengelig: DateDurationMap,
    dagerSak: DateDurationMap
): DateDurationMap => {
    const ikkeGyldigeDager: DateDurationMap = {};
    Object.keys(dagerTilgjengelig).forEach((isoDate) => {
        if (dagerSak[isoDate] === undefined || isValidDuration(dagerSak[isoDate]) === false) {
            ikkeGyldigeDager[isoDate] = dagerTilgjengelig[isoDate];
        }
    });
    return ikkeGyldigeDager;
};

export const beregNormalarbeidstidUtFraUkesnitt = (ukesnitt: string): Duration => {
    const tid = getNumberFromNumberInputValue(ukesnitt);
    if (!tid) {
        throw new Error('beregNormalarbeidstid - invalid tid');
    }
    const { hours, minutes } = decimalTimeToTime(tid / 5);
    return {
        hours: `${hours}`,
        minutes: `${minutes}`,
    };
};
