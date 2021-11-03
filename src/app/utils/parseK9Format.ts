import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsgiverK9Format,
    ArbeidstidDagK9Format,
    K9Format,
    TilsynsordningPerioderK9Format,
} from '../types/k9Format';
import { K9AktivitetArbeidstid, K9ArbeidsgivereArbeidstidMap, K9Sak } from '../types/K9Sak';
import { TidEnkeltdag } from '../types/SoknadFormData';
import {
    dateIsWithinDateRange,
    getISODatesInISODateRangeWeekendExcluded,
    ISODateRangeToDateRange,
    ISODateToDate,
    ISODurationToTime,
} from './dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from './endringsperiode';

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

const dateIsIWithinDateRanges = (date: Date, dateRanges: DateRange[]) =>
    dateRanges.some((dateRange) => dateIsWithinDateRange(date, dateRange));

export const getAktivitetArbeidstidFromK9Format = (
    data: ArbeidstidDagK9Format,
    søknadsperioder: DateRange[]
): K9AktivitetArbeidstid => {
    const arbeidstid: K9AktivitetArbeidstid = {
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
            const date = ISODateToDate(isoDate);
            const dateIsInSøknadsperioder = dateIsIWithinDateRanges(date, søknadsperioder);
            if (dateIsInSøknadsperioder) {
                arbeidstid.faktisk[isoDate] = getTid(ISODurationToTime(data[isoDateRange].faktiskArbeidTimerPerDag));
                arbeidstid.normalt[isoDate] = getTid(ISODurationToTime(data[isoDateRange].jobberNormaltTimerPerDag));
            }
        });
    });

    return arbeidstid;
};

const getArbeidstidArbeidsgivere = (
    arbeidsgivere: ArbeidsgiverK9Format[],
    søknadsperioder: DateRange[]
): K9ArbeidsgivereArbeidstidMap => {
    const arbeidsgivereMap: K9ArbeidsgivereArbeidstidMap = {};
    arbeidsgivere.forEach((a) => {
        arbeidsgivereMap[a.organisasjonsnummer] = getAktivitetArbeidstidFromK9Format(
            a.arbeidstidInfo.perioder,
            søknadsperioder
        );
    });
    return arbeidsgivereMap;
};

export const parseK9Format = (data: K9Format): K9Sak => {
    const { ytelse, søker, søknadId } = data;
    const endringsdato = getEndringsdato();
    const søknadsperioder = getSøknadsperioderInnenforTillattEndringsperiode(
        endringsdato,
        ytelse.søknadsperiode.map((periode) => ISODateRangeToDateRange(periode))
    );
    const sak: K9Sak = {
        søker: søker,
        søknadId: søknadId,
        ytelse: {
            type: 'PLEIEPENGER_SYKT_BARN',
            barn: {
                fødselsdato: ISODateToDate(ytelse.barn.fødselsdato),
                norskIdentitetsnummer: ytelse.barn.norskIdentitetsnummer,
            },
            søknadsperioder,
            tilsynsordning: {
                enkeltdager: getTilsynsdagerFromK9Format(ytelse.tilsynsordning.perioder),
            },
            arbeidstid: {
                arbeidsgivereMap: getArbeidstidArbeidsgivere(ytelse.arbeidstid.arbeidstakerList, søknadsperioder),
                frilanser: ytelse.arbeidstid.frilanserArbeidstidInfo
                    ? getAktivitetArbeidstidFromK9Format(
                          ytelse.arbeidstid.frilanserArbeidstidInfo.perioder,
                          søknadsperioder
                      )
                    : undefined,
                selvstendig: ytelse.arbeidstid.selvstendigNæringsdrivendeArbeidstidInfo
                    ? getAktivitetArbeidstidFromK9Format(
                          ytelse.arbeidstid.selvstendigNæringsdrivendeArbeidstidInfo.perioder,
                          søknadsperioder
                      )
                    : undefined,
            },
        },
    };
    console.log(sak);

    return sak;
};
