import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-formik/lib';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SoknadFormData, TidEnkeltdag } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmsorgstilbudIPerioder from './omsorgstilbud/OmsorgstilbudIPerioder';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    endringsdato: Date;
    søknadsperioder: DateRange[];
    tidIOmsorgstilbudSak?: TidEnkeltdag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudStep: React.FunctionComponent<Props> = ({
    endringsdato,
    søknadsperioder,
    onOmsorgstilbudChanged,
    tidIOmsorgstilbudSak = {},
}) => {
    const stepId = StepID.OMSORGSTILBUD;

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            <Box margin="xl">
                <OmsorgstilbudIPerioder
                    endringsdato={endringsdato}
                    søknadsperioder={søknadsperioder}
                    tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                    onOmsorgstilbudChanged={onOmsorgstilbudChanged}
                />
            </Box>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
