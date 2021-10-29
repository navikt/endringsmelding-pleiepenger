import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsgiverK9Format,
    ArbeidstidDagK9Format,
    K9Format,
    TilsynsordningPerioderK9Format,
} from '../types/k9Format';
import { K9ArbeidsgiverArbeidstid, K9Arbeidstid, K9Sak } from '../types/K9Sak';
import { TidEnkeltdag } from '../types/SoknadFormData';
import {
    dateIsWithinDateRange,
    getISODatesInISODateRangeWeekendExcluded,
    ISODateRangeToDateRange,
    ISODateToDate,
    ISODurationToTime,
} from './dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from './endringsperiode';

const getArbeidstidArbeidsgivere = (arbeidsgivere: ArbeidsgiverK9Format[]): K9Arbeidstid => {
    const arbeidstid: K9Arbeidstid = {
        arbeidsgivereMap: {},
    };
    arbeidsgivere.forEach((a) => {
        arbeidstid.arbeidsgivereMap[a.organisasjonsnummer] = getArbeidsgiverArbeidstidFromK9Format(
            a.arbeidstidInfo.perioder
        );
    });
    return arbeidstid;
};

export const getTilsynsdagerFromK9Format = (data: TilsynsordningPerioderK9Format): TidEnkeltdag => {
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

export const getArbeidsgiverArbeidstidFromK9Format = (
    data: ArbeidstidDagK9Format,
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

export const parseK9Format = (data: K9Format): K9Sak => {
    const { ytelse, søker, søknadId } = data;
    const endringsdato = getEndringsdato();
    const sak: K9Sak = {
        søker: søker,
        søknadId: søknadId,
        ytelse: {
            type: 'PLEIEPENGER_SYKT_BARN',
            barn: {
                fødselsdato: ISODateToDate(ytelse.barn.fødselsdato),
                norskIdentitetsnummer: ytelse.barn.norskIdentitetsnummer,
            },
            søknadsperioder: getSøknadsperioderInnenforTillattEndringsperiode(
                endringsdato,
                ytelse.søknadsperiode.map((periode) => ISODateRangeToDateRange(periode))
            ),
            tilsynsordning: {
                enkeltdager: getTilsynsdagerFromK9Format(ytelse.tilsynsordning.perioder),
            },
            arbeidstid: getArbeidstidArbeidsgivere(ytelse.arbeidstid.arbeidstakerList),
        },
    };
    return sak;
};
