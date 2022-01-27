import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import { HvaSkalEndres } from '../../../types';
import DinePlikterContent from '../dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from '../personopplysninger/Personopplysninger';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    onStart: (values: FormValues) => void;
}

enum FormField {
    hvaSkalEndres = 'hvaSkalEndres',
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
}

interface FormValues {
    [FormField.hvaSkalEndres]: HvaSkalEndres[];
    [FormField.harForståttRettigheterOgPlikter]: boolean;
}

const VelgSakFormInitialValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormField, FormValues, ValidationError>();

const InngangForm: React.FunctionComponent<Props> = ({ onStart }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    const handleOnValidSubmit = (values: FormValues) => {
        onStart(values);
    };

    return (
        <FormComponents.FormikWrapper
            initialValues={VelgSakFormInitialValues}
            onSubmit={() => null}
            renderForm={({ values }) => {
                return (
                    <FormComponents.Form
                        onValidSubmit={() => handleOnValidSubmit(values)}
                        includeButtons={false}
                        formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
                        <section aria-label="Skjema">
                            <FormBlock>
                                <FormComponents.CheckboxPanelGroup
                                    id="abc"
                                    name={FormField.hvaSkalEndres}
                                    legend={'Hva ønsker du å gjøre?'}
                                    validate={getRequiredFieldValidator()}
                                    checkboxes={[
                                        {
                                            id: 'arbeidstid',
                                            label: (
                                                <>
                                                    <Element>
                                                        <FormattedMessage id="inngangForm.hvaSkalEndres.arbeidstid.1" />
                                                    </Element>{' '}
                                                    <FormattedMessage id="inngangForm.hvaSkalEndres.arbeidstid.2" />
                                                </>
                                            ),
                                            value: HvaSkalEndres.arbeidstid,
                                        },
                                        {
                                            id: 'omsorgstilbud',
                                            label: (
                                                <>
                                                    <Element>
                                                        <FormattedMessage id="inngangForm.hvaSkalEndres.omsorgstilbud.1" />
                                                    </Element>{' '}
                                                    <FormattedMessage id="inngangForm.hvaSkalEndres.omsorgstilbud.2" />
                                                </>
                                            ),
                                            value: HvaSkalEndres.omsorgstilbud,
                                        },
                                    ]}
                                />
                            </FormBlock>
                            <FormBlock>
                                <FormComponents.ConfirmationCheckbox
                                    label={intlHelper(intl, 'inngangForm.samtykke.tekst')}
                                    name={FormField.harForståttRettigheterOgPlikter}
                                    validate={getCheckedValidator()}>
                                    <FormattedMessage
                                        id="inngangForm.samtykke.harForståttLabel"
                                        values={{
                                            plikterLink: (
                                                <Lenke
                                                    href="#"
                                                    onClick={(): void =>
                                                        setDialogState({ dinePlikterModalOpen: true })
                                                    }>
                                                    {intlHelper(
                                                        intl,
                                                        'inngangForm.samtykke.harForståttLabel.lenketekst'
                                                    )}
                                                </Lenke>
                                            ),
                                        }}
                                    />
                                </FormComponents.ConfirmationCheckbox>
                                <Box textAlignCenter={true} margin="xl">
                                    <Hovedknapp>{intlHelper(intl, 'inngangForm.button.start')}</Hovedknapp>
                                </Box>
                            </FormBlock>
                        </section>
                        <FormBlock>
                            <div style={{ textAlign: 'center' }}>
                                <Lenke
                                    href="#"
                                    onClick={(): void =>
                                        setDialogState({ behandlingAvPersonopplysningerModalOpen: true })
                                    }>
                                    <FormattedMessage id="inngangForm.personopplysninger.lenketekst" />
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
                            onRequestClose={(): void =>
                                setDialogState({ behandlingAvPersonopplysningerModalOpen: false })
                            }
                            contentLabel={intlHelper(intl, 'modal.personopplysninger.dialogtittel')}>
                            <BehandlingAvPersonopplysningerContent />
                        </InfoDialog>
                    </FormComponents.Form>
                );
            }}
        />
    );
};

export default InngangForm;
