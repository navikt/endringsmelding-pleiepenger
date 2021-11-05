import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { useIntl } from 'react-intl';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { ArbeidsforholdType } from '../../components/tid-uker-input/types';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { getArbeidsformValidator, getJobberNormaltTimerValidator } from '../../validation/fieldValidations';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidsformOgTimerFormPart from './parts/ArbeidsformOgTimerFormPart';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    nyeArbeidsforhold: Arbeidsgiver[];
}

const ArbeidssituasjonStep: React.FunctionComponent<Props> = ({ nyeArbeidsforhold }) => {
    const stepId = StepID.ARBEIDSSITUASJON;
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>
                Intro til steget som sier noe om at vi har funnet arbeidsforhold som ikke er registrert i K9, og at vi
                dermed ikke har normalarbeidstid registrert. Nedenfor vil alle arbeidsforhold hvor dette ikke er
                registert være listet opp og bruker må svare på alle sammen.
            </StepIntroduction>
            {nyeArbeidsforhold.map(({ navn, organisasjonsnummer }) => {
                const fieldKey = `#${organisasjonsnummer}`;
                const arbeidssituasjon = values.arbeidssituasjon?.arbeidsgiver[fieldKey];

                const intlValues = {
                    hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: navn }),
                    jobber: intlHelper(intl, 'arbeidsforhold.part.jobber'),
                    arbeidsform: arbeidssituasjon?.arbeidsform
                        ? intlHelper(intl, `arbeidsforhold.part.arbeidsform.${arbeidssituasjon.arbeidsform}`)
                        : undefined,
                };

                return (
                    <FormBlock key={organisasjonsnummer} margin="xl">
                        <Box padBottom="m">
                            <Undertittel tag="h2" style={{ fontWeight: 'normal' }}>
                                {navn} - {organisasjonsnummer}
                            </Undertittel>
                        </Box>
                        <ArbeidsformOgTimerFormPart
                            arbeidsforholdType={ArbeidsforholdType.ANSATT}
                            arbeidssituasjon={arbeidssituasjon}
                            parentFieldName={`${SoknadFormField.arbeidssituasjon}.arbeidsgiver.${fieldKey}`}
                            spørsmål={{
                                arbeidsform: intlHelper(intl, 'arbeidsforhold.arbeidsform.spm', {
                                    arbeidsforhold: navn,
                                }),
                                jobberNormaltTimer: (arbeidsform) =>
                                    intlHelper(intl, `arbeidsforhold.${arbeidsform}.spm`, {
                                        arbeidsforhold: navn,
                                    }),
                            }}
                            validator={{
                                arbeidsform: getArbeidsformValidator(intlValues),
                                jobberNormaltTimer: getJobberNormaltTimerValidator(intlValues),
                            }}
                        />
                    </FormBlock>
                );
            })}
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
