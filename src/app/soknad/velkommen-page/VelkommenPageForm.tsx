import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { SoknadFormField } from '../../types/SoknadFormData';
import DinePlikterContent from './dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from './personopplysninger/Personopplysninger';
import { FormikCheckboxPanelGroup } from '@navikt/sif-common-formik/lib';
import { Element } from 'nav-frontend-typografi';

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
        <SoknadFormComponents.Form onValidSubmit={onStart} includeButtons={false}>
            <FormBlock>
                <FormikCheckboxPanelGroup
                    name={'endreHva'}
                    legend={'Velg hva du ønsker å endre:'}
                    checkboxes={[
                        {
                            id: 'omsorgstilbud',
                            label: (
                                <>
                                    <Element>Omsorgstilbud</Element>Legg til, endre eller fjern tid i omsorgstilbud
                                </>
                            ),
                            value: 'omsorgstilbud',
                        },
                        {
                            id: 'arbeidstid',
                            label: (
                                <>
                                    <Element>Arbeidstid</Element>Legg til, endre eller fjern arbeidstid
                                </>
                            ),
                            value: 'arbeidstid',
                        },
                    ]}
                />
            </FormBlock>
            <Box margin="xl">
                <p>
                    Vil du melde fra om andre endringer i din eller barnets situasjon?{' '}
                    <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">Gå til skriv til oss</Lenke>.
                </p>
            </Box>
            <FormBlock>
                <SoknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'samtykke.tekst')}
                    name={SoknadFormField.harForståttRettigheterOgPlikter}
                    validate={(value) => {
                        return value !== true
                            ? intlHelper(intl, 'validation.harForståttRettigheterOgPlikter.noValue')
                            : undefined;
                    }}>
                    <FormattedMessage
                        id="samtykke.harForståttLabel"
                        values={{
                            plikterLink: (
                                <Lenke href="#" onClick={(): void => setDialogState({ dinePlikterModalOpen: true })}>
                                    {intlHelper(intl, 'samtykke.harForståttLabel.lenketekst')}
                                </Lenke>
                            ),
                        }}
                    />
                </SoknadFormComponents.ConfirmationCheckbox>
                <Box textAlignCenter={true} margin="xl">
                    <Hovedknapp>{intlHelper(intl, 'step.velkommen.button.start')}</Hovedknapp>
                    <FormBlock>
                        <Lenke
                            href="#"
                            onClick={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                            <FormattedMessage id="step.velkommen.personopplysninger.lenketekst" />
                        </Lenke>
                    </FormBlock>
                </Box>
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
