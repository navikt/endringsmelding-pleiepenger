import { Time } from '@navikt/sif-common-formik/lib';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { K9Arbeidstid } from '../types/K9Sak';
import { ArbeidstidFormValue, HvaSkalEndres, TidEnkeltdag } from '../types/SoknadFormData';
import { timeHasSameDuration } from '../utils/dateUtils';

export type TidPerDagValidator = (dag: string) => (tid: Time) => ValidationError | undefined;

const erTidEndret = (enkeltdager: TidEnkeltdag, tidOpprinnelig: TidEnkeltdag): boolean => {
    const harEndringer = Object.keys(enkeltdager).some((key) => {
        return timeHasSameDuration(enkeltdager[key], tidOpprinnelig[key]) === false;
    });
    return harEndringer;
};

export const getHvaSkalEndresValidator =
    (skalEndreArbeidssituasjon: boolean) =>
    (value: HvaSkalEndres[]): ValidationError | undefined => {
        console.log(value);

        if (skalEndreArbeidssituasjon === false) {
            return getRequiredFieldValidator()(value);
        }
        const endreArbeidssituasjonErValgt = (value || []).some((a) => {
            return a === HvaSkalEndres.arbeidssituasjon;
        });

        if (endreArbeidssituasjonErValgt === false) {
            return 'endreArbeidssituasjonIkkeValgt';
        }
        return undefined;
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
        Object.keys(arbeidstid.arbeidsgiver).forEach((a) => {
            if (endret) {
                return;
            }
            if (erTidEndret(arbeidstid.arbeidsgiver[a].faktisk, arbeidstakerMap[a].faktisk)) {
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

export const getArbeidsformValidator = (intlValues: { hvor: string; jobber: string }) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidsforhold.arbeidsform.noValue',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
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
