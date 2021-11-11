import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
// import { useFormikContext } from 'formik';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { K9SakMeta } from '../../types/K9Sak';
import { SoknadFormData, TidEnkeltdag } from '../../types/SoknadFormData';
// import { validateOmsorgstilbud } from '../../validation/fieldValidations';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmsorgstilbudMånedListe from './OmsorgstilbudMånedListe';
// import { Undertittel } from 'nav-frontend-typografi';

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
    // const { values } = useFormikContext<SoknadFormData>();

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>
                <p>
                    Her legger du inn endringer i omsorgstilbud som er oppstått i pleiepengeperioden din. Du skal melde
                    fra om endringer når{' '}
                </p>
                <ul>
                    <li>barnet skal starte eller slutte å være fast og regelmessig i et omsorgstilbud, eller når</li>
                    <li>tiden barnet er i omsorgstilbudet endrer seg til en ny fast og regelmessig tid.</li>
                </ul>
                <p>
                    Du skal ikke melde fra hvis det kun er små endringer i tiden barnet er i omsorgstilbudet. Det er
                    bare hvis det er endring i tiden barnet skal være der fast og regelmessig at du må melde fra.
                </p>
                <Box margin="l">
                    <ExpandableInfo title="Eksempel på når du må melde fra om endring i bruk av omsorgstilbud">
                        Tina er fast og regelmessig i barnehagen to timer hver dag, men av og til må hun hentes en
                        halvtime tidligere. I dette tilfellet skal du ikke melde fra om endring, ettersom det ikke er en
                        endring i tiden hun fast og regelmessig er i barnehagen. Men, hvis Tina skal endre fra å være to
                        timer til tre timer fast i barnehagen hver dag, må du melde fra om endring ettersom den nye
                        tiden er fast og regelmessig.
                    </ExpandableInfo>
                </Box>
            </StepIntroduction>

            <Box margin="xl">
                <SoknadFormComponents.InputGroup
                    // legend={<Undertittel>Perioder du kan endre tid i omsorgstilbud</Undertittel>}
                    // description={
                    //     <>
                    //         Under ser du perioder du har søkt om pleiepenger. Det er kun dager du har søkt om
                    //         pleiepenger som er tilgjengelige for endring.{' '}
                    //     </>
                    // }
                    name={'omsorgstilbud_liste' as any}
                    // validate={() =>
                    //     validateOmsorgstilbud({
                    //         tidOpprinnelig: tidIOmsorgstilbudSak,
                    //         tid: values.omsorgstilbud?.enkeltdager,
                    //     })
                    // }
                >
                    <OmsorgstilbudMånedListe
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        k9sakMeta={k9sakMeta}
                        onOmsorgstilbudChanged={onOmsorgstilbudChanged}
                    />
                </SoknadFormComponents.InputGroup>
            </Box>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
