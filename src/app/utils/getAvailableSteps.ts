import { skalEndreArbeidstid, skalEndreOmsorgstilbud, StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';

export const getAvailableSteps = (values: Partial<SoknadFormData>): StepID[] => {
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
