import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getCheckedValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { HvaSkalEndres, SoknadFormField } from '../../types/SoknadFormData';
import DinePlikterContent from './dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from './personopplysninger/Personopplysninger';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    nyeArbeidsforhold: Arbeidsgiver[];
    onStart: () => void;
}

const VelkommenPageForm: React.FunctionComponent<Props> = ({ nyeArbeidsforhold, onStart }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            {nyeArbeidsforhold.length > 0 && (
                <AlertStripeInfo>
                    Vi ser at du har fått nye arbeidsforhold siden sist. For å kunne sende inn en melding om endring, må
                    du da også fylle ut informasjon om hvordan du jobber hos denne/disse.
                </AlertStripeInfo>
            )}
            <section aria-label="Skjema" role="form">
                <FormBlock>
                    <SoknadFormComponents.CheckboxPanelGroup
                        id="abc"
                        name={SoknadFormField.hvaSkalEndres}
                        legend={'Hva du ønsker å gjøre?'}
                        validate={getRequiredFieldValidator()}
                        checkboxes={[
                            {
                                id: 'arbeidstid',
                                label: (
                                    <>
                                        <Element>Endre arbeidstid</Element>Legg til eller endre hvor mye du har eller
                                        skal jobbe
                                    </>
                                ),
                                value: HvaSkalEndres.arbeidstid,
                            },
                            {
                                id: 'omsorgstilbud',
                                label: (
                                    <>
                                        <Element>Endre tid i et omsorgstilbud</Element>Legg til eller endre hvor mye tid
                                        barnet har vært i et fast og regelmessig omsorgstilbud
                                    </>
                                ),
                                value: HvaSkalEndres.omsorgstilbud,
                            },
                        ]}
                    />
                </FormBlock>
                <Box margin="xl">
                    <p>
                        Vil du melde fra om andre endringer i din eller barnets situasjon?{' '}
                        <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">
                            Gå til skriv til oss
                        </Lenke>
                        .
                    </p>
                </Box>
                <FormBlock>
                    <SoknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'samtykke.tekst')}
                        name={SoknadFormField.harForståttRettigheterOgPlikter}
                        validate={getCheckedValidator()}>
                        <FormattedMessage
                            id="samtykke.harForståttLabel"
                            values={{
                                plikterLink: (
                                    <Lenke
                                        href="#"
                                        onClick={(): void => setDialogState({ dinePlikterModalOpen: true })}>
                                        {intlHelper(intl, 'samtykke.harForståttLabel.lenketekst')}
                                    </Lenke>
                                ),
                            }}
                        />
                    </SoknadFormComponents.ConfirmationCheckbox>
                    <Box textAlignCenter={true} margin="xl">
                        <Hovedknapp>{intlHelper(intl, 'step.velkommen.button.start')}</Hovedknapp>
                    </Box>
                </FormBlock>
            </section>
            <FormBlock>
                <Lenke href="#" onClick={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                    <FormattedMessage id="step.velkommen.personopplysninger.lenketekst" />
                </Lenke>
            </FormBlock>
            <InfoDialog
                contentLabel={intlHelper(intl, 'modal.dinePlikter.dialog.tittel')}
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={(): void => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>
            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'modal.personopplysninger.dialogtittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </SoknadFormComponents.Form>
    );
};

export default VelkommenPageForm;
