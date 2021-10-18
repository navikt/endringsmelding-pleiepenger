import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-formik/lib';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SoknadFormData, TidEnkeltdag } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmsorgstilbudIPeriodeSpørsmål from './omsorgstilbud/OmsorgstilbudIPeriodeSpørsmål';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    endringsperiode: DateRange;
    endringsdato: Date;
    tidIOmsorgstilbud?: TidEnkeltdag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudStep: React.FunctionComponent<Props> = ({
    endringsperiode: periode,
    endringsdato,
    onOmsorgstilbudChanged,
    tidIOmsorgstilbud = {},
}) => {
    const stepId = StepID.OMSORGSTILBUD;

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            <Box margin="xl">
                <OmsorgstilbudIPeriodeSpørsmål
                    periode={periode}
                    endringsdato={endringsdato}
                    tidIOmsorgstilbud={tidIOmsorgstilbud}
                    onOmsorgstilbudChanged={onOmsorgstilbudChanged}
                />
            </Box>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
