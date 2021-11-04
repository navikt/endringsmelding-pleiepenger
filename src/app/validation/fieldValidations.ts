import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { K9Arbeidstid } from '../types/K9Sak';
import { ArbeidstidFormValue, TidEnkeltdag } from '../types/SoknadFormData';
import { timeHasSameDuration } from '../utils/dateUtils';

export type TidPerDagValidator = (dag: string) => (tid: Time) => ValidationError | undefined;

const erTidEndret = (enkeltdager: TidEnkeltdag, tidOpprinnelig: TidEnkeltdag): boolean => {
    const harEndringer = Object.keys(enkeltdager).some((key) => {
        return timeHasSameDuration(enkeltdager[key], tidOpprinnelig[key]) === false;
    });
    return harEndringer;
};

export const validateOmsorgstilbud = ({
    tid,
    tidOpprinnelig,
}: {
    tid?: TidEnkeltdag;
    tidOpprinnelig: TidEnkeltdag;
}): ValidationError | undefined => {
    if (!tid || erTidEndret(tid, tidOpprinnelig) === false) {
        return 'ingenEndringer';
    }
    return undefined;
};

export const validateArbeidstid = ({
    tid,
    tidOpprinnelig,
}: {
    tid?: TidEnkeltdag;
    tidOpprinnelig: TidEnkeltdag;
}): ValidationError | undefined => {
    if (!tid || erTidEndret(tid, tidOpprinnelig) === false) {
        return 'ingenEndringer';
    }
    return undefined;
};

export const validateAktivitetArbeidstid = ({
    arbeidstid,
    arbeidstidSak,
}: {
    arbeidstid?: ArbeidstidFormValue;
    arbeidstidSak: K9Arbeidstid;
}): ValidationError | undefined => {
    if (arbeidstid === undefined) {
        return 'ingenEndringer';
    }
    let endret = false;
    const { arbeidsgivereMap } = arbeidstidSak;
    if (arbeidstid.arbeidsgiver && arbeidsgivereMap) {
        Object.keys(arbeidstid.arbeidsgiver).forEach((a) => {
            if (endret) {
                return;
            }
            if (erTidEndret(arbeidstid.arbeidsgiver[a].faktisk, arbeidsgivereMap[a].faktisk)) {
                endret = true;
            }
        });
    }
    if (!endret && arbeidstid.frilanser && arbeidstidSak.frilanser) {
        if (erTidEndret(arbeidstid.frilanser.faktisk, arbeidstidSak.frilanser.faktisk)) {
            endret = true;
        }
    }
    if (!endret && arbeidstid.selvstendig && arbeidstidSak.selvstendig) {
        if (erTidEndret(arbeidstid.selvstendig.faktisk, arbeidstidSak.selvstendig.faktisk)) {
            endret = true;
        }
    }
    return endret ? undefined : 'ingenEndringer';
};
