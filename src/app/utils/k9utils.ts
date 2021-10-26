import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { flatten } from 'lodash';
import { DagerIkkeSøktForMap, DagerSøktForMap } from '../types';
import {
    K9ArbeidsgiverArbeidstid,
    K9ArbeidsgivereArbeidstidMap,
    K9Sak,
    K9SakMeta,
    MånedMedSøknadsperioderMap as MånedMedSøknadsperioderMap,
} from '../types/K9Sak';
import {
    dateIsWithinDateRange,
    getDateRangeFromDateRanges,
    getDateRangesBetweenDateRanges,
    getDatesInDateRange,
    getMonthDateRange,
    getMonthsInDateRange,
    getYearsInDateRanges,
    ISODateToDate,
} from './dateUtils';
import { getEndringsdato, getEndringsperiode, getMaksEndringsperiode } from './endringsperiode';
import { getUtilgjengeligeDatoerIMåned } from './utilgjengeligeDatoerUtils';

type ISODateObject = { [key: string]: any };

export const getISODateObjectsWithinDateRange = <E extends ISODateObject>(
    data: E,
    dateRange: DateRange,
    getDagerIkkeSøktFor: DagerIkkeSøktForMap
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
    dagerIPeriodeDetIkkeErSøktFor: DagerIkkeSøktForMap
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

export const getDagerIkkeSøktFor = (søknadsperioder: DateRange[]): DagerIkkeSøktForMap => {
    const hull = getDateRangesBetweenDateRanges(søknadsperioder);
    const dagerIkkeSøktFor: DagerIkkeSøktForMap = {};
    hull.forEach((periode) => {
        const datoer = getDatesInDateRange(periode, false);
        datoer.forEach((d) => (dagerIkkeSøktFor[dateToISOString(d)] = true));
    });
    return dagerIkkeSøktFor;
};

export const getDagerSøktFor = (søknadsperioder: DateRange[]): DagerSøktForMap => {
    const dagerSøktFor: DagerSøktForMap = {};
    søknadsperioder.forEach((periode) => {
        const datoer = getDatesInDateRange(periode, true);
        datoer.forEach((d) => (dagerSøktFor[dateToISOString(d)] = true));
    });
    return dagerSøktFor;
};

export const getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');

export const getDateRangeFromYearMonthKey = (yearMonthKey: string): DateRange => {
    const [year, month] = yearMonthKey.split('-');
    return getMonthDateRange(new Date(parseInt(year, 10), parseInt(month, 10) - 1));
};

export const getMånederMedSøknadsperioder = (søknadsperioder: DateRange[]): MånedMedSøknadsperioderMap => {
    const måneder: MånedMedSøknadsperioderMap = {};
    flatten(søknadsperioder.map((periode) => getMonthsInDateRange(periode))).forEach((periode) => {
        const key = getYearMonthKey(periode.from);
        måneder[key] = måneder[key] ? [...måneder[key], periode] : [periode];
    });
    return måneder;
};

const getK9SakMeta = (endringsdato: Date, søknadsperioder: DateRange[]): K9SakMeta => {
    const endringsperiode = getEndringsperiode(endringsdato, søknadsperioder);
    const dagerIkkeSøktFor = getDagerIkkeSøktFor(søknadsperioder);
    const dagerSøktFor = getDagerIkkeSøktFor(søknadsperioder);
    const alleMånederISøknadsperiode = getMonthsInDateRange(getDateRangeFromDateRanges(søknadsperioder));
    const månederMedSøknadsperiodeMap = getMånederMedSøknadsperioder(søknadsperioder);
    const antallMånederUtenSøknadsperiode =
        alleMånederISøknadsperiode.length - Object.keys(månederMedSøknadsperiodeMap).length;
    const søknadsperioderGårOverFlereÅr = getYearsInDateRanges(alleMånederISøknadsperiode).length > 1;
    const utilgjengeligeDatoer: Date[] = Object.keys(dagerIkkeSøktFor).map((dato) => ISODateToDate(dato));
    const utilgjengeligeDatoerIMåned = {};

    Object.keys(månederMedSøknadsperiodeMap).forEach((key) => {
        const måned = getDateRangeFromYearMonthKey(key);
        utilgjengeligeDatoerIMåned[key] = getUtilgjengeligeDatoerIMåned(utilgjengeligeDatoer, måned, endringsperiode);
    });

    return {
        endringsdato,
        endringsperiode,
        søknadsperioder,
        dagerIkkeSøktForMap: dagerIkkeSøktFor,
        dagerSøktForMap: dagerSøktFor,
        månederMedSøknadsperiodeMap: månederMedSøknadsperiodeMap,
        alleMånederISøknadsperiode,
        søknadsperioderGårOverFlereÅr,
        antallMånederUtenSøknadsperiode,
        utilgjengeligeDatoer,
        utilgjengeligeDatoerIMåned,
    };
};

export const trimK9SakForSøknad = (k9sak: K9Sak): { sak: K9Sak; meta: K9SakMeta } => {
    const sak: K9Sak = { ...k9sak };
    const endringsdato = getEndringsdato();
    const maksEndringsperiode = getMaksEndringsperiode(endringsdato);
    const {
        ytelse: {
            søknadsperioder,
            arbeidstid: { arbeidsgivereMap: arbeidsgivere },
            tilsynsordning: { enkeltdager: tilsynEnkeltdager },
        },
    } = sak;

    const meta = getK9SakMeta(endringsdato, søknadsperioder);
    const { dagerIkkeSøktForMap: dagerIkkeSøktFor } = meta;

    /** Trim arbeidstid ansatt */
    if (arbeidsgivere) {
        const trimmedArbeidsgiverTid: K9ArbeidsgivereArbeidstidMap = {};
        Object.keys(arbeidsgivere).forEach((key) => {
            trimmedArbeidsgiverTid[key] = trimArbeidstidTilTillatPeriode(
                arbeidsgivere[key],
                maksEndringsperiode,
                meta.dagerIkkeSøktForMap
            );
        });
        sak.ytelse.arbeidstid.arbeidsgivereMap = trimmedArbeidsgiverTid;
    }

    /** Trim tilsynsordning */
    if (tilsynEnkeltdager) {
        sak.ytelse.tilsynsordning.enkeltdager = getISODateObjectsWithinDateRange(
            tilsynEnkeltdager,
            maksEndringsperiode,
            dagerIkkeSøktFor
        );
    }

    return { sak, meta };
};
