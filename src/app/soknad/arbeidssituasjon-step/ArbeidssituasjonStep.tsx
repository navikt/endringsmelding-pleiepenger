import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { ArbeidsforholdType } from '../../components/tid-uker-input/types';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import {
    getArbeidssituasjonFieldKeyForArbeidsgiver,
    getArbeidssituasjonForArbeidsgiver,
} from '../../utils/arbeidssituasjonUtils';
import { getJobberNormaltTimerValidator } from '../../validation/fieldValidations';
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
            {nyeArbeidsforhold.map((arbeidsgiver) => {
                const { navn, id: ident } = arbeidsgiver;

                const arbeidssituasjon = getArbeidssituasjonForArbeidsgiver(ident, values.arbeidssituasjon);

                const intlValues = {
                    hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: navn }),
                    jobber: intlHelper(intl, 'arbeidsforhold.part.jobber'),
                };

                const fieldName = `${
                    SoknadFormField.arbeidssituasjon
                }.arbeidsgiver.${getArbeidssituasjonFieldKeyForArbeidsgiver(ident)}`;

                return (
                    <FormBlock key={ident} margin="xl">
                        <Box padBottom="m">
                            <Undertittel tag="h2">
                                {navn} - {ident}
                            </Undertittel>
                        </Box>
                        <ArbeidsformOgTimerFormPart
                            arbeidsforholdType={ArbeidsforholdType.ANSATT}
                            arbeidssituasjon={arbeidssituasjon}
                            parentFieldName={fieldName}
                            spørsmål={{
                                jobberNormaltTimer: intlHelper(intl, `arbeidsforhold.antallTimer.spm`, {
                                    arbeidsforhold: navn,
                                }),
                            }}
                            validator={{
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
