import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sak } from '../../types/Sak';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';

interface Props {
    saker: Sak[];
    onVelgSak: (sak: Sak) => void;
}
export enum VelgSakFormField {
    'barnAktørId' = 'barnAktørId',
}

export interface VelgSakFormData {
    [VelgSakFormField.barnAktørId]: string;
}

export const VelgSakFormInitialValues: Partial<VelgSakFormData> = {
    [VelgSakFormField.barnAktørId]: undefined,
};

const FormComponents = getTypedFormComponents<VelgSakFormField, VelgSakFormData, ValidationError>();

const VelgSakPage = ({ saker, onVelgSak }: Props) => {
    const intl = useIntl();

    const onBarnValgt = (value: string) => {
        const valgtSak = saker.find((sak) => sak.barn.aktørId === value);
        if (valgtSak) {
            onVelgSak(valgtSak);
        }
    };

    useLogSidevisning('velgSak');
    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <section aria-label="Introduksjon">
                    <InformationPoster>
                        Du har flere saker registrert. Velg hvilken sak du ønsker å endre nedenfor:
                    </InformationPoster>
                </section>
            </Box>
            <FormBlock>
                <FormComponents.FormikWrapper
                    initialValues={VelgSakFormInitialValues}
                    onSubmit={() => null}
                    renderForm={({ values }) => {
                        return (
                            <section aria-label="Velg sak">
                                <FormComponents.Form
                                    includeValidationSummary={true}
                                    includeButtons={true}
                                    onValidSubmit={() => {
                                        onBarnValgt(values[VelgSakFormField.barnAktørId]);
                                    }}
                                    formErrorHandler={getIntlFormErrorHandler(intl, 'velgSakForm.validation')}
                                    submitButtonLabel="Gå videre">
                                    <FormComponents.RadioPanelGroup
                                        name={VelgSakFormField.barnAktørId}
                                        legend={'Hvilket barn gjelder endringen?'}
                                        useTwoColumns={true}
                                        radios={saker.map((sak) => {
                                            const { fornavn, mellomnavn, etternavn, fødselsdato, aktørId } = sak.barn;
                                            const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                                            return {
                                                value: aktørId,
                                                key: aktørId,
                                                label: (
                                                    <>
                                                        <Normaltekst>{barnetsNavn}</Normaltekst>
                                                        <Normaltekst>Født {prettifyDate(fødselsdato)}</Normaltekst>
                                                    </>
                                                ),
                                            };
                                        })}
                                        validate={getRequiredFieldValidator()}
                                    />
                                </FormComponents.Form>
                            </section>
                        );
                    }}
                />{' '}
            </FormBlock>
        </Page>
    );
};

export default VelgSakPage;
