import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import { DagerIkkeSøktFor } from '../types';
import { K9ArbeidsgiverArbeidstid, K9ArbeidsgivereArbeidstid, K9Sak } from '../types/K9Sak';
import { dateIsWithinDateRange, getDateRangesBetweenDateRanges, getDatesInDateRange, ISODateToDate } from './dateUtils';
import { getEndringsdato, getMaksEndringsperiode } from './endringsperiode';

type ISODateObject = { [key: string]: any };

export const getISODateObjectsWithinDateRange = <E extends ISODateObject>(
    data: E,
    dateRange: DateRange,
    getDagerIkkeSøktFor: DagerIkkeSøktFor
): E => {
    const result = {};
    Object.keys(data).forEach((isoDate) => {
        const date = ISODateToDate(isoDate);
        if (typeof date === 'string') {
            throw new Error('Invalid formatted date');
        }
        if (dateIsWithinDateRange(date, dateRange) && getDagerIkkeSøktFor[isoDate] === undefined) {
            result[isoDate] = data[isoDate];
        }
    });
    return result as E;
};

export const trimArbeidstidTilTillatPeriode = (
    arbeidstid: K9ArbeidsgiverArbeidstid,
    maksEndringsperiode: DateRange,
    dagerIPeriodeDetIkkeErSøktFor: DagerIkkeSøktFor
): K9ArbeidsgiverArbeidstid => {
    const result: K9ArbeidsgiverArbeidstid = {
        faktisk: getISODateObjectsWithinDateRange(
            arbeidstid.faktisk,
            maksEndringsperiode,
            dagerIPeriodeDetIkkeErSøktFor
        ),
        normalt: getISODateObjectsWithinDateRange(
            arbeidstid.normalt,
            maksEndringsperiode,
            dagerIPeriodeDetIkkeErSøktFor
        ),
    };
    return result;
};

export const getDagerIkkeSøktFor = (søknadsperioder: DateRange[]): DagerIkkeSøktFor => {
    const hull = getDateRangesBetweenDateRanges(søknadsperioder);
    const dagerIkkeSøktFor: DagerIkkeSøktFor = {};
    hull.forEach((periode) => {
        const datoer = getDatesInDateRange(periode, false);
        datoer.forEach((d) => (dagerIkkeSøktFor[dateToISOString(d)] = true));
    });
    return dagerIkkeSøktFor;
};

export const trimK9SakForSøknad = (k9sak: K9Sak): K9Sak => {
    const sak: K9Sak = { ...k9sak };
    const maksEndringsperiode = getMaksEndringsperiode(getEndringsdato());
    const {
        ytelse: {
            søknadsperioder,
            arbeidstid: { arbeidsgivere: arbeidsgivere },
            tilsynsordning: { enkeltdager: tilsynEnkeltdager },
        },
    } = sak;

    const dagerIkkeSøktFor = getDagerIkkeSøktFor(søknadsperioder);

    /** Trim arbeidstid ansatt */
    if (arbeidsgivere) {
        const trimmedArbeidsgiverTid: K9ArbeidsgivereArbeidstid = {};
        Object.keys(arbeidsgivere).forEach((key) => {
            trimmedArbeidsgiverTid[key] = trimArbeidstidTilTillatPeriode(
                arbeidsgivere[key],
                maksEndringsperiode,
                dagerIkkeSøktFor
            );
        });
        sak.ytelse.arbeidstid.arbeidsgivere = trimmedArbeidsgiverTid;
    }

    /** Trim tilsynsordning */
    if (tilsynEnkeltdager) {
        sak.ytelse.tilsynsordning.enkeltdager = getISODateObjectsWithinDateRange(
            tilsynEnkeltdager,
            maksEndringsperiode,
            dagerIkkeSøktFor
        );
    }

    return sak;
};
