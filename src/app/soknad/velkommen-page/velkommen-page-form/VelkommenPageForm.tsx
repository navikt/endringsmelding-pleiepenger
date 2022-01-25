import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getCheckedValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import { HvaSkalEndres, SoknadFormField } from '../../../types/SoknadFormData';
import SoknadFormComponents from '../../SoknadFormComponents';
import DinePlikterContent from '../dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from '../personopplysninger/Personopplysninger';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    onStart: () => void;
}

const VelkommenPageForm: React.FunctionComponent<Props> = ({ onStart }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            <section aria-label="Skjema">
                <FormBlock>
                    <SoknadFormComponents.CheckboxPanelGroup
                        id="abc"
                        name={SoknadFormField.hvaSkalEndres}
                        legend={'Hva ønsker du å gjøre?'}
                        validate={getRequiredFieldValidator()}
                        checkboxes={[
                            {
                                id: 'arbeidstid',
                                label: (
                                    <>
                                        <Element>
                                            <FormattedMessage id="velkommenPageForm.hvaSkalEndres.arbeidstid.1" />
                                        </Element>{' '}
                                        <FormattedMessage id="velkommenPageForm.hvaSkalEndres.arbeidstid.2" />
                                    </>
                                ),
                                value: HvaSkalEndres.arbeidstid,
                            },
                            {
                                id: 'omsorgstilbud',
                                label: (
                                    <>
                                        <Element>
                                            <FormattedMessage id="velkommenPageForm.hvaSkalEndres.omsorgstilbud.1" />
                                        </Element>{' '}
                                        <FormattedMessage id="velkommenPageForm.hvaSkalEndres.omsorgstilbud.2" />
                                    </>
                                ),
                                value: HvaSkalEndres.omsorgstilbud,
                            },
                        ]}
                    />
                </FormBlock>
                <FormBlock>
                    <SoknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'velkommenPageForm.samtykke.tekst')}
                        name={SoknadFormField.harForståttRettigheterOgPlikter}
                        validate={getCheckedValidator()}>
                        <FormattedMessage
                            id="velkommenPageForm.samtykke.harForståttLabel"
                            values={{
                                plikterLink: (
                                    <Lenke
                                        href="#"
                                        onClick={(): void => setDialogState({ dinePlikterModalOpen: true })}>
                                        {intlHelper(intl, 'velkommenPageForm.samtykke.harForståttLabel.lenketekst')}
                                    </Lenke>
                                ),
                            }}
                        />
                    </SoknadFormComponents.ConfirmationCheckbox>
                    <Box textAlignCenter={true} margin="xl">
                        <Hovedknapp>{intlHelper(intl, 'velkommenPageForm.button.start')}</Hovedknapp>
                    </Box>
                </FormBlock>
            </section>
            <FormBlock>
                <div style={{ textAlign: 'center' }}>
                    <Lenke
                        href="#"
                        onClick={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                        <FormattedMessage id="velkommenPageForm.personopplysninger.lenketekst" />
                    </Lenke>
                </div>
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
