import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { SoknadFormData } from '../types/SoknadFormData';

export enum StepID {
    'OMSORGSTILBUD' = 'omsorgstilbud',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'ARBEIDSTID' = 'arbeidstid',
    'OPPSUMMERING' = 'oppsummering',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSoknadSteps = (values: SoknadFormData): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.OMSORGSTILBUD);
    // steps.push(StepID.ARBEIDSSITUASJON);
    // steps.push(StepID.ARBEIDSTID);
    steps.push(StepID.OPPSUMMERING);
    return steps;
};

export const getSoknadStepsConfig = (values: SoknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.MELDING);
