import { skalEndreArbeidstid, skalEndreOmsorgstilbud, StepID } from '../soknad/soknadStepsConfig';
import { Person } from '../types/Person';
import { SoknadFormData } from '../types/SoknadFormData';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAvailableSteps = (values: Partial<SoknadFormData>, søker: Person): StepID[] => {
    const steps: StepID[] = [];
    if (skalEndreOmsorgstilbud(values)) {
        steps.push(StepID.OMSORGSTILBUD);
    }
    if (skalEndreArbeidstid(values)) {
        steps.push(StepID.ARBEIDSTID);
    }
    steps.push(StepID.OPPSUMMERING);
    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
