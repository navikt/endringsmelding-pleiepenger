import React from 'react';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

const ArbeidssituasjonStep: React.FunctionComponent = () => {
    const stepId = StepID.ARBEIDSSITUASJON;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            <p>TODO</p>
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
