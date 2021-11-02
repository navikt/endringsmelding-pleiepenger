import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { TidEnkeltdag } from '../types/SoknadFormData';
import { timeHasSameDuration } from '../utils/dateUtils';

export type TidPerDagValidator = (dag: string) => (tid: Time) => ValidationError | undefined;

const erOmsorgstilbudEndret = (enkeltdager: TidEnkeltdag, tidIOmsorgstilbudSak: TidEnkeltdag): boolean => {
    const harEndringer = Object.keys(enkeltdager).some((key) => {
        return timeHasSameDuration(enkeltdager[key], tidIOmsorgstilbudSak[key]) === false;
    });
    return harEndringer;
};

export const validateOmsorgstilbud =
    (tidIOmsorgstilbudSak: TidEnkeltdag) =>
    (enkeltdager?: TidEnkeltdag): ValidationError | undefined => {
        if (!enkeltdager || erOmsorgstilbudEndret(enkeltdager, tidIOmsorgstilbudSak) === false) {
            return 'ingenEndringer';
        }
        return undefined;
    };
