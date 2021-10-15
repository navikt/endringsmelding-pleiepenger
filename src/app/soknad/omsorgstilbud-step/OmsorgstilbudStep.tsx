import React from 'react';
// import { useFormikContext } from 'formik';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

const OmsorgstilbudStep: React.FunctionComponent = () => {
    const stepId = StepID.OMSORGSTILBUD;
    // const { values } = useFormikContext<SoknadFormData>();
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            <p>TODO</p>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
