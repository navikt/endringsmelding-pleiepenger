import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { IntlShape } from 'react-intl';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9ArbeidstakerMap, K9ArbeidstidInfo } from '../types/K9Sak';
import { ArbeidssituasjonFormValue, Arbeidssituasjon } from '../types/SoknadFormData';

export const getArbeidssituasjonFieldKeyForArbeidsgiver = (orgnr: string) => `#${orgnr}`;

export const getArbeidssituasjonForArbeidsgiver = (
    orgnr: string,
    arbeidssituasjon?: ArbeidssituasjonFormValue
): Arbeidssituasjon | undefined => {
    const fieldKey = getArbeidssituasjonFieldKeyForArbeidsgiver(orgnr);
    return arbeidssituasjon ? arbeidssituasjon?.arbeidsgiver[fieldKey] : undefined;
};

export const getArbeidstidForArbeidsgiver = (orgnr: string, arbeidstakerMap?: K9ArbeidstakerMap): K9ArbeidstidInfo => {
    if (arbeidstakerMap === undefined || arbeidstakerMap[orgnr] === undefined) {
        return { faktisk: {}, normalt: {} };
    }
    return arbeidstakerMap[orgnr];
};

export const erNyttArbeidsforhold = (orgnr: string, nyeArbeidsforhold: Arbeidsgiver[]): boolean => {
    return nyeArbeidsforhold.some((a) => a.organisasjonsnummer === orgnr);
};

export const getTimerTekst = (intl: IntlShape, value: string | undefined): string => {
    const timer = getNumberFromNumberInputValue(value);
    if (timer) {
        return intlHelper(intl, 'timer', {
            timer,
        });
    }
    return intlHelper(intl, 'timer.ikkeTall', {
        timer: value,
    });
};
