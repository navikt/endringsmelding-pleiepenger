import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '../../../components/tid-uker-input/types';
import { ArbeidsforholdField, Arbeidsform, ArbeidssituasjonInfo, SoknadFormField } from '../../../types/SoknadFormData';
import SoknadFormComponents from '../../SoknadFormComponents';
import ArbeidsformInfo from '../info/ArbeidsformInfo';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
    arbeidssituasjon?: ArbeidssituasjonInfo;
    parentFieldName: string;
    validator: {
        arbeidsform: ValidationFunction<ValidationError>;
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        arbeidsform: string;
        jobberNormaltTimer: (arbeidsform: Arbeidsform) => string;
    };
}

const ArbeidsformOgTimerFormPart: React.FunctionComponent<Props> = ({
    arbeidsforholdType,
    arbeidssituasjon,
    parentFieldName,
    validator,
    spørsmål,
}) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as SoknadFormField;

    return (
        <>
            <FormBlock margin="none">
                <SoknadFormComponents.RadioPanelGroup
                    legend={spørsmål.arbeidsform}
                    name={getFieldName(ArbeidsforholdField.arbeidsform)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.fast'),
                            value: Arbeidsform.fast,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus'),
                            value: Arbeidsform.turnus,
                        },
                        {
                            label: (
                                <>
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.1" />
                                    /&shy;
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.2" />
                                    /&shy;
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.3" />
                                </>
                            ),
                            value: Arbeidsform.varierende,
                        },
                    ]}
                    validate={validator.arbeidsform}
                />
            </FormBlock>
            {arbeidssituasjon?.arbeidsform !== undefined && (
                <FormBlock>
                    <SoknadFormComponents.NumberInput
                        label={spørsmål.jobberNormaltTimer(arbeidssituasjon?.arbeidsform)}
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        suffix={intlHelper(
                            intl,
                            `arbeidsforhold.arbeidsform.${arbeidssituasjon.arbeidsform}.timer.suffix`
                        )}
                        suffixStyle="text"
                        description={
                            <div style={{ width: '100%' }}>
                                {arbeidssituasjon.arbeidsform === Arbeidsform.fast && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.fast}
                                            arbeidsforholdType={arbeidsforholdType}
                                            erAvsluttet={false}
                                        />
                                    </Box>
                                )}
                                {arbeidssituasjon.arbeidsform === Arbeidsform.turnus && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.turnus}
                                            arbeidsforholdType={arbeidsforholdType}
                                            erAvsluttet={false}
                                        />
                                    </Box>
                                )}
                                {arbeidssituasjon.arbeidsform === Arbeidsform.varierende && (
                                    <>
                                        <Box margin="m">
                                            <ArbeidsformInfo
                                                arbeidsform={Arbeidsform.varierende}
                                                arbeidsforholdType={arbeidsforholdType}
                                                erAvsluttet={false}
                                            />
                                        </Box>
                                    </>
                                )}
                            </div>
                        }
                        bredde="XS"
                        value={arbeidssituasjon.jobberNormaltTimer || ''}
                        validate={validator.jobberNormaltTimer}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsformOgTimerFormPart;
