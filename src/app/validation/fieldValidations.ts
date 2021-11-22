import { Time } from '@navikt/sif-common-formik/lib';
import { getNumberValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { K9Arbeidstid } from '../types/K9Sak';
import { ArbeidstidFormValue, TidEnkeltdag, TidFasteDager } from '../types/SoknadFormData';
import { getArbeidstidForArbeidsgiver } from '../utils/arbeidssituasjonUtils';
import { timeHasSameDuration } from '../utils/dateUtils';
import { sumTimerFasteDager } from '../utils/tidsbrukUtils';

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
    const { arbeidstakerMap } = arbeidstidSak;
    if (arbeidstid.arbeidsgiver && arbeidstakerMap) {
        Object.keys(arbeidstid.arbeidsgiver).forEach((orgnr) => {
            if (endret) {
                return;
            }
            if (
                erTidEndret(
                    arbeidstid.arbeidsgiver[orgnr].faktisk,
                    getArbeidstidForArbeidsgiver(orgnr, arbeidstakerMap).faktisk
                )
            ) {
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

export const validateFasteArbeidstimerIUke = (
    fasteDager: TidFasteDager | undefined
): ValidationResult<ValidationError> => {
    let error;
    const timer = fasteDager ? sumTimerFasteDager(fasteDager) : 0;
    if (timer === 0) {
        error = 'ingenTidRegistrert';
    }
    if (timer > 37.5) {
        error = 'forMangeTimerRegistrert';
    }
    return error
        ? {
              key: `arbeidstidPeriode.fasteDager.${error}`,
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getArbeidstimerFastDagValidator =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 24, minutes: 0 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `arbeidstidPeriode.fasteDager.dag.${error}`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const MIN_TIMER_NORMAL_ARBEIDSFORHOLD = 0.01;
export const MAX_TIMER_NORMAL_ARBEIDSFORHOLD = 100;

export const getJobberNormaltTimerValidator =
    (intlValues: { hvor: string; jobber: string; arbeidsform?: string }) => (value: any) => {
        if (!intlValues.arbeidsform) {
            return undefined;
        }
        const error = getNumberValidator({
            required: true,
            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
        })(value);

        return error
            ? {
                  key: `validation.arbeidsforhold.jobberNormaltTimer.${error}`,
                  values: {
                      ...intlValues,
                      min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                      max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                  },
                  keepKeyUnaltered: true,
              }
            : undefined;
    };
