import { DateRange } from '@navikt/sif-common-formik/lib';
import { K9ArbeidsgiverArbeidstid, K9ArbeidsgivereArbeidstid, K9Sak } from '../types/K9Sak';
import { dateIsWithinDateRange, ISODateToDate } from './dateUtils';
import { getEndringsdato, getMaksEndringsperiode } from './endringsperiode';

type ISODateObject = { [key: string]: any };

export const getISODateObjectsWithinDateRange = <E extends ISODateObject>(data: E, dateRange: DateRange): E => {
    const result = {};
    Object.keys(data).forEach((isoDate) => {
        const date = ISODateToDate(isoDate);
        if (typeof date === 'string') {
            throw new Error('Invalid formatted date');
        }
        if (dateIsWithinDateRange(date, dateRange)) {
            result[isoDate] = data[isoDate];
        }
    });
    return result as E;
};

export const trimArbeidstidTilMaksEndringsperiode = (
    arbeidstid: K9ArbeidsgiverArbeidstid,
    maksEndringsperiode: DateRange
): K9ArbeidsgiverArbeidstid => {
    const result: K9ArbeidsgiverArbeidstid = {
        faktisk: getISODateObjectsWithinDateRange(arbeidstid.faktisk, maksEndringsperiode),
        normalt: getISODateObjectsWithinDateRange(arbeidstid.normalt, maksEndringsperiode),
    };
    return result;
};

export const trimK9SakTilMaksEndringsperiode = (k9sak: K9Sak): K9Sak => {
    const sak: K9Sak = { ...k9sak };

    const maksEndringsperiode = getMaksEndringsperiode(getEndringsdato());

    const {
        ytelse: {
            arbeidstid: { arbeidsgivere: arbeidsgivere },
            tilsynsordning: { enkeltdager: tilsynEnkeltdager },
        },
    } = sak;

    /** Trim arbeidstid ansatt */
    if (arbeidsgivere) {
        const trimmedArbeidsgiverTid: K9ArbeidsgivereArbeidstid = {};
        Object.keys(arbeidsgivere).forEach((key) => {
            trimmedArbeidsgiverTid[key] = trimArbeidstidTilMaksEndringsperiode(arbeidsgivere[key], maksEndringsperiode);
        });
        sak.ytelse.arbeidstid.arbeidsgivere = trimmedArbeidsgiverTid;
    }

    /** Trim tilsynsordning */
    if (tilsynEnkeltdager) {
        sak.ytelse.tilsynsordning.enkeltdager = getISODateObjectsWithinDateRange(
            tilsynEnkeltdager,
            maksEndringsperiode
        );
    }

    return sak;
};
