import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { HvaSkalEndres, SoknadFormData } from '../types/SoknadFormData';

export enum StepID {
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'ARBEIDSTID' = 'arbeidstid',
    'OMSORGSTILBUD' = 'omsorgstilbud',
    'OPPSUMMERING' = 'oppsummering',
}

export const skalEndreOmsorgstilbud = ({ hvaSkalEndres }: Partial<SoknadFormData>): boolean => {
    return (hvaSkalEndres || []).some((a) => {
        return a === HvaSkalEndres.omsorgstilbud;
    });
};

export const skalEndreArbeidstid = ({ hvaSkalEndres }: Partial<SoknadFormData>): boolean => {
    return (hvaSkalEndres || []).some((a) => a === HvaSkalEndres.arbeidstid);
};

export const skalEndreArbeidssituasjon = (nyeArbeidsforhold: Arbeidsgiver[]): boolean => nyeArbeidsforhold.length > 0;

const getSoknadSteps = (values: SoknadFormData, nyeArbeidsforhold: Arbeidsgiver[]): StepID[] => {
    const steps: StepID[] = [];
    if (skalEndreArbeidssituasjon(nyeArbeidsforhold)) {
        steps.push(StepID.ARBEIDSSITUASJON);
    }
    if (skalEndreArbeidstid(values)) {
        steps.push(StepID.ARBEIDSTID);
    }
    if (skalEndreOmsorgstilbud(values)) {
        steps.push(StepID.OMSORGSTILBUD);
    }
    steps.push(StepID.OPPSUMMERING);
    return steps;
};

export const getSoknadStepsConfig = (
    values: SoknadFormData,
    nyeArbeidsforhold: Arbeidsgiver[]
): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values, nyeArbeidsforhold), SoknadApplicationType.MELDING);
