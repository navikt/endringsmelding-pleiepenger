/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    // skalEndreArbeidssituasjon,
    skalEndreArbeidstid,
    skalEndreOmsorgstilbud,
    StepID,
} from '../soknad/soknadStepsConfig';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { Person } from '../types/Person';
import { SoknadFormData } from '../types/SoknadFormData';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAvailableSteps = (
    values: Partial<SoknadFormData>,
    søker: Person,
    nyeArbeidsforhold: Arbeidsgiver[]
): StepID[] => {
    const steps: StepID[] = [];
    // if (skalEndreArbeidssituasjon(nyeArbeidsforhold)) {
    //     steps.push(StepID.ARBEIDSSITUASJON);
    // }
    if (skalEndreArbeidstid(values)) {
        steps.push(StepID.ARBEIDSTID);
    }
    if (skalEndreOmsorgstilbud(values)) {
        steps.push(StepID.OMSORGSTILBUD);
    }
    steps.push(StepID.OPPSUMMERING);
    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
