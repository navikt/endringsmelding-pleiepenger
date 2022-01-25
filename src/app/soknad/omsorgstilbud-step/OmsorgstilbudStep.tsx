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
import OmsorgstilbudMånedListe from './OmsorgstilbudMånedListe';

const cleanupOmsorgstilbudStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    tidIOmsorgstilbudSak?: TidEnkeltdag;
    sakMetadata: SakMetadata;
    onOmsorgstilbudChanged?: () => void;
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
                    dagene du har søkt om pleiepenger. Du skal melde fra om endringer når{' '}
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
                        <p>
                            Tina er fast og regelmessig i barnehagen to timer hver dag, men av og til må hun hentes en
                            halvtime tidligere. I dette tilfellet skal du ikke melde fra om endring, ettersom det ikke
                            er en endring i tiden hun fast og regelmessig er i barnehagen.
                        </p>
                        <p>
                            Hvis Tina skal endre fra å være to timer til tre timer fast i barnehagen hver dag, må du
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
                    <OmsorgstilbudMånedListe
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
