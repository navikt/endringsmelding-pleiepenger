import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData, ValidationError>();

const IntroForm: React.FunctionComponent<Props> = ({ onValidSubmit }) => {
    const intl = useIntl();

    const kanFortsetteFn = (values: IntroFormData): { kanFortsette: boolean; erStoppet: boolean } => {
        return {
            kanFortsette: values[IntroFormField.harPleiepenger] === YesOrNo.YES,
            erStoppet: values[IntroFormField.harPleiepenger] === YesOrNo.NO,
        };
    };

    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values }) => {
                const { kanFortsette, erStoppet } = kanFortsetteFn(values);
                return (
                    <section aria-label="Se om du kan bruke det dette skjemaet:">
                        <IntroFormComponents.Form
                            includeValidationSummary={true}
                            includeButtons={kanFortsette}
                            formErrorHandler={getIntlFormErrorHandler(intl, 'introForm.validation')}
                            noButtonsContentRenderer={
                                kanFortsette || erStoppet
                                    ? undefined
                                    : () => (
                                          <UnansweredQuestionsInfo>
                                              <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                          </UnansweredQuestionsInfo>
                                      )
                            }
                            submitButtonLabel="Gå videre">
                            <FormQuestion
                                legend={'Har du pleiepenger ... eller noe sånt?'}
                                name={IntroFormField.harPleiepenger}
                                validate={getYesOrNoValidator()}
                            />
                            {erStoppet && (
                                <FormBlock>
                                    <AlertStripeInfo>Informasjon om at en ikke kan bruke løsningen</AlertStripeInfo>
                                </FormBlock>
                            )}
                        </IntroFormComponents.Form>
                    </section>
                );
            }}
        />
    );
};

export default IntroForm;
