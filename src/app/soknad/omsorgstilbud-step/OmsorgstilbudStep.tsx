import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SoknadFormData, TidEnkeltdag } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmsorgstilbudMånedListe from './OmsorgstilbudMånedListe';
import { K9SakMeta } from '../../types/K9Sak';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    tidIOmsorgstilbudSak?: TidEnkeltdag;
    k9sakMeta: K9SakMeta;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudStep: React.FunctionComponent<Props> = ({
    onOmsorgstilbudChanged,
    k9sakMeta,
    tidIOmsorgstilbudSak = {},
}) => {
    const stepId = StepID.OMSORGSTILBUD;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>
                Her melder du fra om endringer når tiden barnet oppholder seg i et{' '}
                <strong>fast og regelmessig omsorgstilbud</strong>
                endrer seg. Du skal ikke melde fra om endring hvis bruken av omsorgstilbudet er uforutsigbart og
                uregelmessig. Du skal melde fra om endringer i omsorgstilbud når
                <ul>
                    <li>
                        tiden barnet oppholder seg i et fast og regelmessig omsorgstilbud endrer seg,
                        <br />
                        og når
                    </li>
                    <li>barnet begynner eller slutter i et fast og regelmessig omsorgstilbud.</li>
                </ul>
            </StepIntroduction>

            <Box margin="xl">
                <OmsorgstilbudMånedListe
                    tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                    k9sakMeta={k9sakMeta}
                    onOmsorgstilbudChanged={onOmsorgstilbudChanged}
                />
            </Box>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
