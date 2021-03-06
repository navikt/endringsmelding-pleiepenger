import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateDurationMap } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { SakMetadata, TidEnkeltdag } from '../../types/Sak';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import EndreOmsorgstilbudPeriode from './endre-omsorgstilbud-periode/EndreOmsorgstilbudPeriode';
import OmsorgstilbudMÃ¥nedListe from './OmsorgstilbudMÃ¥nedListe';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    tidIOmsorgstilbudSak?: TidEnkeltdag;
    sakMetadata: SakMetadata;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudStep: React.FunctionComponent<Props> = ({
    onOmsorgstilbudChanged,
    sakMetadata,
    tidIOmsorgstilbudSak = {},
}) => {
    const stepId = StepID.OMSORGSTILBUD;
    const { setFieldValue, values } = useFormikContext<SoknadFormData>();
    const tidOmsorgstilbud = values.omsorgstilbud?.enkeltdager || {};

    const handleOnPeriodeChange = (data: DateDurationMap) => {
        const dagerMedOmsorgstilbud = { ...tidOmsorgstilbud, ...data };
        setFieldValue(SoknadFormField.omsorgstilbud_enkeltdager, dagerMedOmsorgstilbud);
        if (onOmsorgstilbudChanged) {
            onOmsorgstilbudChanged();
        }
    };

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupOmsorgstilbudStep}>
            <StepIntroduction>
                <p>
                    Her legger du inn endringer i hvor mange timer barnet er fast og regelmessig i et omsorgstilbud de
                    dagene du har sÃ¸kt om pleiepenger. Du skal melde fra om endringer nÃ¥r{' '}
                </p>
                <ul>
                    <li>barnet skal starte eller slutte Ã¥ vÃ¦re fast og regelmessig i et omsorgstilbud, eller nÃ¥r</li>
                    <li>tiden barnet er i omsorgstilbudet endrer seg til en ny fast og regelmessig tid.</li>
                </ul>
                <p>
                    Du skal ikke melde fra hvis det kun er smÃ¥ endringer i tiden barnet er i omsorgstilbudet. Det er
                    bare hvis det er endring i tiden barnet skal vÃ¦re der fast og regelmessig at du mÃ¥ melde fra.
                </p>
                <Box margin="l">
                    <ExpandableInfo title="Eksempel pÃ¥ nÃ¥r du mÃ¥ melde fra om endring i bruk av omsorgstilbud">
                        <p>
                            Tina er fast og regelmessig i barnehagen to timer hver dag, men av og til mÃ¥ hun hentes en
                            halvtime tidligere. I dette tilfellet skal du ikke melde fra om endring, ettersom det ikke
                            er en endring i tiden hun fast og regelmessig er i barnehagen.
                        </p>
                        <p>
                            Hvis Tina skal endre fra Ã¥ vÃ¦re to timer til tre timer fast i barnehagen hver dag, mÃ¥ du
                            melde fra om endring ettersom den nye tiden er fast og regelmessig.
                        </p>
                    </ExpandableInfo>
                </Box>
            </StepIntroduction>

            <Box margin="xl">
                <ResponsivePanel>
                    <Box padBottom="l">
                        <EndreOmsorgstilbudPeriode
                            gjelderFortid={true}
                            periode={sakMetadata.endringsperiode}
                            onPeriodeChange={handleOnPeriodeChange}
                        />
                    </Box>
                    <OmsorgstilbudMÃ¥nedListe
                        tidOmsorgstilbud={tidOmsorgstilbud}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        sakMetadata={sakMetadata}
                        onOmsorgstilbudChanged={onOmsorgstilbudChanged}
                    />
                </ResponsivePanel>
            </Box>
        </SoknadFormStep>
    );
};

export default OmsorgstilbudStep;
