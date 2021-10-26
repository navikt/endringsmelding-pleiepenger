import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { ISODate, ISODateRange, ISODuration } from '../types';
import { K9ArbeidsgiverArbeidstid, K9Arbeidstid, K9Sak } from '../types/K9Sak';
import { TidEnkeltdag } from '../types/SoknadFormData';
import {
    dateIsWithinDateRange,
    getISODatesInISODateRangeWeekendExcluded,
    ISODateRangeToDateRange,
    ISODateToDate,
    ISODurationToTime,
} from '../utils/dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from '../utils/endringsperiode';

export type TilsynsordningPerioderK9Remote = {
    [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export type ArbeidstidDagK9Remote = {
    [key: ISODateRange]: {
        jobberNormaltTimerPerDag: ISODuration;
        faktiskArbeidTimerPerDag: ISODuration;
    };
};

interface ArbeidsgiverK9Remote {
    norskIdentitetsnummer?: string;
    organisasjonsnummer: string;
    arbeidstidInfo: {
        perioder: ArbeidstidDagK9Remote;
    };
}

export const getTilsynsdagerFromK9Format = (data: TilsynsordningPerioderK9Remote): TidEnkeltdag => {
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
    data: ArbeidstidDagK9Remote,
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

export interface K9SakRemote {
    søknadId: string;
    versjon: string;
    mottattDato: string;
    søker: {
        norskIdentitetsnummer: string;
    };
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: ISODate;
        };
        søknadsperiode: ISODateRange[];
        tilsynsordning: {
            perioder: TilsynsordningPerioderK9Remote;
        };
        arbeidstid: {
            arbeidstakerList: ArbeidsgiverK9Remote[];
        };
    };
}

const getArbeidstidArbeidsgivere = (arbeidsgivere: ArbeidsgiverK9Remote[]): K9Arbeidstid => {
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

export const parseK9SakRemote = (data: K9SakRemote): K9Sak => {
    const { ytelse, søker, søknadId } = data;
    const endringsdato = getEndringsdato();
    const sak: K9Sak = {
        søker: søker,
        søknadId: søknadId,
        ytelse: {
            type: 'PLEIEPENGER_SYKT_BARN',
            barn: {
                fødselsdato: apiStringDateToDate(ytelse.barn.fødselsdato),
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
