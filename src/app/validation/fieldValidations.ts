import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { K9ArbeidsgivereArbeidstidMap } from '../types/K9Sak';
import { ArbeidstidArbeidsgiverMap, TidEnkeltdag } from '../types/SoknadFormData';
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

export const validateArbeidstidAlleArbeidsgivere = ({
    arbeidsgivereMap,
    arbeidsgivereSakMap,
}: {
    arbeidsgivereMap?: ArbeidstidArbeidsgiverMap;
    arbeidsgivereSakMap: K9ArbeidsgivereArbeidstidMap;
}): ValidationError | undefined => {
    if (arbeidsgivereMap === undefined) {
        return 'ingenEndringer';
    }
    let endret = false;
    Object.keys(arbeidsgivereMap).forEach((a) => {
        if (endret) {
            return;
        }
        if (erTidEndret(arbeidsgivereMap[a].faktisk, arbeidsgivereSakMap[a].faktisk)) {
            endret = true;
        }
    });
    if (endret === false) {
        return 'ingenEndringer';
    }
    return undefined;
};
