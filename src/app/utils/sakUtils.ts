import { DateRange } from '@navikt/sif-common-utils';
import {
    dateToISODate,
    getDateRangeFromDateRanges,
    getDateRangesBetweenDateRanges,
    getDatesInDateRange,
    getMonthDateRange,
    getMonthsInDateRange,
    getYearsInDateRanges,
    isDateInDateRange,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { flatten } from 'lodash';
import moize from 'moize';
import { DagerIkkeSøktForMap, DagerSøktForMap } from '../types';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import {
    ArbeidstakerMap,
    ArbeidstidEnkeltdagSak,
    MånedMedSøknadsperioderMap as MånedMedSøknadsperioderMap,
    Sak,
    SakMedMeta,
    SakMetadata,
    YtelseArbeidstid,
} from '../types/Sak';
import { getEndringsdato, getEndringsperiode, getMaksEndringsperiode } from './endringsperiode';
import { getUtilgjengeligeDatoerIMåned } from './getUtilgjengeligeDatoerIMåned';

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
        if (isDateInDateRange(date, dateRange) && getDagerIkkeSøktFor[isoDate] === undefined) {
            result[isoDate] = data[isoDate];
        }
    });
    return result as E;
};

export const trimArbeidstidTilTillatPeriode = (
    arbeidstid: ArbeidstidEnkeltdagSak,
    maksEndringsperiode: DateRange,
    dagerIPeriodeDetIkkeErSøktFor: DagerIkkeSøktForMap
): ArbeidstidEnkeltdagSak => {
    const result: ArbeidstidEnkeltdagSak = {
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
        datoer.forEach((d) => (dagerIkkeSøktFor[dateToISODate(d)] = true));
    });
    return dagerIkkeSøktFor;
};

export const getDagerSøktFor = (søknadsperioder: DateRange[]): DagerSøktForMap => {
    const dagerSøktFor: DagerSøktForMap = {};
    søknadsperioder.forEach((periode) => {
        const datoer = getDatesInDateRange(periode, true);
        datoer.forEach((d) => (dagerSøktFor[dateToISODate(d)] = true));
    });
    return dagerSøktFor;
};

export const _getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');
export const getYearMonthKey = moize(_getYearMonthKey);

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

const getSakMetadata = (endringsdato: Date, søknadsperioder: DateRange[]): SakMetadata => {
    const endringsperiode = getEndringsperiode(endringsdato, søknadsperioder);
    const dagerIkkeSøktForMap = getDagerIkkeSøktFor(søknadsperioder);
    const dagerSøktForMap = getDagerSøktFor(søknadsperioder);
    const alleMånederISøknadsperiode = getMonthsInDateRange(getDateRangeFromDateRanges(søknadsperioder));
    const månederMedSøknadsperiodeMap = getMånederMedSøknadsperioder(søknadsperioder);
    const antallMånederUtenSøknadsperiode =
        alleMånederISøknadsperiode.length - Object.keys(månederMedSøknadsperiodeMap).length;
    const søknadsperioderGårOverFlereÅr = getYearsInDateRanges(alleMånederISøknadsperiode).length > 1;
    const datoerIkkeSøktFor: Date[] = Object.keys(dagerIkkeSøktForMap).map((dato) => ISODateToDate(dato));
    const datoerIkkeSøktForIMåned = {};

    Object.keys(månederMedSøknadsperiodeMap).forEach((key) => {
        const måned = getDateRangeFromYearMonthKey(key);
        datoerIkkeSøktForIMåned[key] = getUtilgjengeligeDatoerIMåned(datoerIkkeSøktFor, måned.from, endringsperiode);
    });

    return {
        endringsdato,
        endringsperiode,
        søknadsperioder,
        dagerIkkeSøktForMap,
        dagerSøktForMap,
        månederMedSøknadsperiodeMap,
        alleMånederISøknadsperiode,
        søknadsperioderGårOverFlereÅr,
        antallMånederUtenSøknadsperiode,
        datoerIkkeSøktFor,
        datoerIkkeSøktForIMåned,
    };
};

export const getSakMedMetadata = (opprinneligSak: Sak): SakMedMeta => {
    const sak: Sak = { ...opprinneligSak };
    const endringsdato = getEndringsdato();
    const maksEndringsperiode = getMaksEndringsperiode(endringsdato);
    const {
        ytelse: {
            søknadsperioder,
            arbeidstid: { arbeidstakerMap: arbeidsgivere },
            tilsynsordning: { enkeltdager: tilsynEnkeltdager },
        },
    } = sak;

    const meta = getSakMetadata(endringsdato, søknadsperioder);
    const { dagerIkkeSøktForMap: dagerIkkeSøktFor } = meta;

    /** Trim arbeidstid ansatt */
    if (arbeidsgivere) {
        const trimmedArbeidsgiverTid: ArbeidstakerMap = {};
        Object.keys(arbeidsgivere).forEach((key) => {
            trimmedArbeidsgiverTid[key] = trimArbeidstidTilTillatPeriode(
                arbeidsgivere[key],
                maksEndringsperiode,
                meta.dagerIkkeSøktForMap
            );
        });
        sak.ytelse.arbeidstid.arbeidstakerMap = trimmedArbeidsgiverTid;
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

export const erArbeidsgivereIBådeSakOgAAreg = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsgivereMap?: ArbeidstakerMap
): boolean =>
    arbeidsgivereMap !== undefined
        ? Object.keys(arbeidsgivereMap).some((orgnr) => arbeidsgivere.some((a) => a.id === orgnr) === false) === false
        : false;

export const harSakArbeidstidInfo = (arbeidsgivere: Arbeidsgiver[], arbeidstidSak: YtelseArbeidstid): boolean => {
    const arbeidsgivereErBådeISakOgAAreg = erArbeidsgivereIBådeSakOgAAreg(arbeidsgivere, arbeidstidSak.arbeidstakerMap);
    return (
        arbeidsgivereErBådeISakOgAAreg ||
        arbeidstidSak.frilanser !== undefined ||
        arbeidstidSak.selvstendig !== undefined
    );
};

// export const getNyeArbeidsforholdIkkeRegistrertISak = (
//     arbeidsgivere: Arbeidsgiver[],
//     k9FormtArbeidsgivere: K9FormatArbeidsgiver[]
// ): Arbeidsgiver[] => {
//     return arbeidsgivere.filter(
//         ({ id }) =>
//             k9FormatArbeidsgivere.some((k9a) => {
//                 const ident = getK9FormatArbeidsgiverIdent(k9a);
//                 return ident ? ident === id : true;
//             }) === false
//     );
// };

// export const getK9FormatArbeidsgiverIdent = (arbeidsgiver: K9FormatArbeidsgiver): string => {
//     if (isK9FormatArbeidsgiverPrivat(arbeidsgiver)) {
//         return arbeidsgiver.norskIdentitetsnummer;
//     }
//     if (isK9FormatArbeidsgiverOrganisasjon(arbeidsgiver)) {
//         return arbeidsgiver.organisasjonsnummer;
//     }
//     throw new Error('Ukjent ident for arbeidsgiver');
// };

export const getDateRangeForSaker = (saker: Sak[]): DateRange => {
    return saker.length === 0
        ? { from: new Date(), to: new Date() }
        : getDateRangeFromDateRanges(
              saker.map((sak) => {
                  return getDateRangeFromDateRanges(sak.ytelse.søknadsperioder);
              })
          );
};

// export const getArbeidsgivereISaker = (saker: Sak[]): ArbeidstidArbeidsgiver[] => {
//     const arbeidsgivere: Arbeidsgiver[] = [];
//     saker.forEach((sak) => {
//         const { arbeidstakerMap } = sak.ytelse.arbeidstid;
//         if (arbeidstakerMap) {
//             Object.keys(arbeidstakerMap).forEach((id) => {
//                 const
//             });
//         }
//     });

//     return arbeidsgivere;
// };
