import { ISODate, ISODateRange, ISODuration } from '@navikt/sif-common-utils/lib';
import { isObject, isString } from 'formik';
import { isArray } from 'lodash';
import { isISODateString } from 'nav-datovelger';
import { ISODateString } from 'nav-datovelger/lib/types';
import { isStringOrNull } from '../utils/typeGuardUtilities';
import { isISODateOrNull, isISODateRange, isISODuration } from './typeguards/typeguards';

export type K9FormatTilsynsordningPerioder = {
    [isoDateRange: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export type K9FormatArbeidstidTid = {
    jobberNormaltTimerPerDag: ISODuration;
    faktiskArbeidTimerPerDag: ISODuration;
};

export type K9FormatArbeidstidPeriode = {
    [isoDateRange: ISODateRange]: K9FormatArbeidstidTid;
};

export interface K9FormatArbeidstidInfo {
    perioder: K9FormatArbeidstidPeriode;
}
export interface K9FormatArbeidstaker {
    norskIdentitetsnummer: string | null;
    organisasjonsnummer: string;
    arbeidstidInfo: K9FormatArbeidstidInfo;
}
export interface K9FormatArbeidstid {
    arbeidstakerList: K9FormatArbeidstaker[];
    frilanserArbeidstidInfo: {
        perioder: K9FormatArbeidstidPeriode;
    } | null;
    selvstendigN√¶ringsdrivendeArbeidstidInfo: {
        perioder: K9FormatArbeidstidPeriode;
    } | null;
}

export interface K9FormatArbeidsgiverPrivat {
    norskIdentitetsnummer: string;
}

export interface K9FormatArbeidsgiverOrganisasjon {
    organisasjonsnummer: string;
}

export const isK9FormatArbeidsgiverOrganisasjon = (
    arbeidsgiver: any
): arbeidsgiver is K9FormatArbeidsgiverOrganisasjon =>
    (arbeidsgiver as K9FormatArbeidsgiverOrganisasjon).organisasjonsnummer !== undefined;

export const isK9FormatArbeidsgiverPrivat = (arbeidsgiver: any): arbeidsgiver is K9FormatArbeidsgiverPrivat =>
    (arbeidsgiver as K9FormatArbeidsgiverPrivat).norskIdentitetsnummer !== undefined;

export type K9FormatArbeidsgiver = K9FormatArbeidsgiverPrivat | K9FormatArbeidsgiverOrganisasjon;

export interface K9FormatOpptjeningAktivitetFrilanser {
    startdato: ISODateString;
    sluttdato?: ISODateString;
    jobberFortsattSomFrilanser: boolean;
}

interface K9FormatYtelseIkkeIBruk {
    endringsperiode: any;
    trekkKravPerioder: any;
    dataBruktTilUtledning: any; // Bekreftet opplysninger etc fra dialogen
    infoFraPunsj: any;
    bosteder: any;
    utenlandsopphold: any;
    beredskap: any;
    nattev√•k: any;
    lovbestemtFerie: any;
    uttak: any;
    omsorg: any;
}
interface K9FormatYtelse {
    type: 'PLEIEPENGER_SYKT_BARN';
    barn: {
        norskIdentitetsnummer: string;
        f√łdselsdato: ISODate | null;
    };
    s√łknadsperiode: ISODateRange[];
    opptjeningAktivitet: {
        frilanser?: K9FormatOpptjeningAktivitetFrilanser;
    };
    tilsynsordning: {
        perioder: K9FormatTilsynsordningPerioder;
    };
    arbeidstid: K9FormatArbeidstid;
}

export interface K9FormatBarn {
    f√łdselsdato: ISODate;
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    akt√łrId: string;
    identitetsnummer: string;
}

export interface K9Format {
    barn: K9FormatBarn;
    s√łknad: {
        s√łknadId: string;
        versjon: string;
        mottattDato: string;
        s√łker: {
            norskIdentitetsnummer: string;
        };
        ytelse: K9FormatYtelse & K9FormatYtelseIkkeIBruk;
        spr√•k: 'nb' | 'nn';
        journalposter: any;
        begrunnelseForInnsending: any;
    };
}

export const itemsAreValidISODateRanges = (keys: string[]): boolean =>
    keys.some((key) => !isISODateRange(key)) === false;

const isK9FormatBarn = (barn: any): barn is K9FormatBarn => {
    const maybeBarn = barn as K9FormatBarn;
    if (
        isObject(maybeBarn) &&
        isISODateString(maybeBarn.f√łdselsdato) &&
        isString(maybeBarn.fornavn) &&
        isStringOrNull(maybeBarn.mellomnavn) &&
        isString(maybeBarn.etternavn) &&
        isString(maybeBarn.akt√łrId) &&
        isString(maybeBarn.identitetsnummer)
    ) {
        return true;
    }
    return false;
};

const isK9FormatArbeidstidTid = (tid: any): tid is K9FormatArbeidstidTid => {
    const t = tid as K9FormatArbeidstidTid;
    if (isObject(t) && isISODuration(t.faktiskArbeidTimerPerDag) && isISODuration(t.jobberNormaltTimerPerDag)) {
        return true;
    }
    return false;
};

const isK9FormatArbeidstidPerioder = (perioder: any): perioder is K9FormatArbeidstidPeriode => {
    if (isObject(perioder)) {
        const keys = Object.keys(perioder);
        const harUgyldigISODateRangeKey = itemsAreValidISODateRanges(keys) === false;
        if (harUgyldigISODateRangeKey) {
            return false;
        }
        const harUgyldigArbeidstid = keys
            .map((key) => perioder[key])
            .some((tid: K9FormatArbeidstidTid) => {
                return isK9FormatArbeidstidTid(tid) === false;
            });

        return harUgyldigArbeidstid === false;
    }
    return false;
};

const isK9FormatArbeidstidInfo = (arbeidstidInfo: any): arbeidstidInfo is K9FormatArbeidstidInfo => {
    const info = arbeidstidInfo as K9FormatArbeidstidInfo;
    if (isObject(info) && (info.perioder === undefined || isK9FormatArbeidstidPerioder(info.perioder))) {
        return true;
    }
    return false;
};

const isK9FormatArbeidstaker = (arbeidstaker: any): arbeidstaker is K9FormatArbeidstaker => {
    const a = arbeidstaker as K9FormatArbeidstaker;
    if (isObject(a)) {
        if (
            (isString(a.organisasjonsnummer) || isString(a.norskIdentitetsnummer)) &&
            isK9FormatArbeidstidInfo(a.arbeidstidInfo)
        ) {
            return true;
        }
        return false;
    }
    return false;
};

const isK9FormatArbeidstid = (arbeidstid: any): arbeidstid is K9FormatArbeidstid => {
    const arb = arbeidstid as K9FormatArbeidstid;
    if (isObject(arb) && isArray(arb.arbeidstakerList)) {
        if (arb.arbeidstakerList.length > 0) {
            if (arb.arbeidstakerList.some((a) => !isK9FormatArbeidstaker(a))) {
                return false;
            }
        }
        if (isObject(arb.frilanserArbeidstidInfo) && isK9FormatArbeidstidInfo(arb.frilanserArbeidstidInfo) === false) {
            return false;
        }
        if (
            isObject(arb.selvstendigN√¶ringsdrivendeArbeidstidInfo) &&
            isK9FormatArbeidstidInfo(arb.selvstendigN√¶ringsdrivendeArbeidstidInfo) === false
        ) {
            return false;
        }
        return true;
    }
    return false;
};

const isS√łknadsperioder = (perioder: any): perioder is ISODateRange[] => {
    if (isArray(perioder) && itemsAreValidISODateRanges(perioder)) {
        return true;
    }
    return false;
};

const isK9FormatTilsynsordningPerioder = (perioder: any): perioder is K9FormatTilsynsordningPerioder => {
    if (isObject(perioder)) {
        const keys = Object.keys(perioder);
        if (itemsAreValidISODateRanges(keys) === false) {
            return false;
        }
        const harUgyldigTilsynsordning = keys.some((key) => {
            const periode = perioder[key];
            return isObject(periode) === false || isISODuration(periode.etablertTilsynTimerPerDag) === false;
        });
        return harUgyldigTilsynsordning === false;
    }
    return false;
};

const isK9FormatTilsynsordning = (tilsynsordning: any): boolean => {
    if (isObject(tilsynsordning) && isK9FormatTilsynsordningPerioder(tilsynsordning.perioder)) {
        return true;
    }
    return false;
};

const isK9FormatYtelse = (ytelse: any): ytelse is K9FormatYtelse => {
    const maybeYtelse = ytelse as K9FormatYtelse;

    if (
        isObject(maybeYtelse) &&
        maybeYtelse.type === 'PLEIEPENGER_SYKT_BARN' &&
        isS√łknadsperioder(maybeYtelse.s√łknadsperiode) &&
        isObject(maybeYtelse.barn) &&
        isISODateOrNull(maybeYtelse.barn.f√łdselsdato) &&
        isString(maybeYtelse.barn.norskIdentitetsnummer) &&
        isK9FormatTilsynsordning(maybeYtelse.tilsynsordning) &&
        isK9FormatArbeidstid(maybeYtelse.arbeidstid) &&
        true
    ) {
        return true;
    }
    return false;
};

export const isK9Format = (sak: any): sak is K9Format => {
    const maybeK9Sak = sak as K9Format;
    if (
        isObject(maybeK9Sak) &&
        isK9FormatBarn(maybeK9Sak.barn) &&
        isObject(maybeK9Sak.s√łknad) &&
        isK9FormatYtelse(maybeK9Sak.s√łknad.ytelse)
    ) {
        return true;
    } else {
        return false;
    }
};

export const k9FormatTypeChecker = {
    isK9FormatBarn,
    isK9FormatYtelse,
    isK9FormatArbeidsgiverOrganisasjon,
    isK9FormatArbeidsgiverPrivat,
    isK9FormatArbeidstaker,
    isK9FormatArbeidstid,
    isK9FormatArbeidstidInfo,
    isK9FormatArbeidstidPerioder,
    isK9FormatArbeidstidTid,
    isK9FormatTilsynsordningPerioder,
    isK9FormatTilsynsordning,
};
