import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { HvaSkalEndres } from '../types';
import { SoknadFormData } from '../types/SoknadFormData';

export enum StepID {
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

const getSoknadSteps = (values: SoknadFormData): StepID[] => {
    const steps: StepID[] = [];

    if (skalEndreArbeidstid(values)) {
        steps.push(StepID.ARBEIDSTID);
    }
    if (skalEndreOmsorgstilbud(values)) {
        steps.push(StepID.OMSORGSTILBUD);
    }
    steps.push(StepID.OPPSUMMERING);
    return steps;
};

export const getSoknadStepsConfig = (values: SoknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.MELDING);
