import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '../../../components/tid-uker-input/types';
import { ArbeidsforholdField, Arbeidssituasjon } from '../../../types/SoknadFormData';
import SoknadFormComponents from '../../SoknadFormComponents';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
    arbeidssituasjon?: Arbeidssituasjon;
    parentFieldName: string;
    validator: {
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        jobberNormaltTimer: string;
    };
}

const ArbeidsformOgTimerFormPart: React.FunctionComponent<Props> = ({
    arbeidssituasjon,
    parentFieldName,
    validator,
    spørsmål,
}) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as any;

    return (
        <>
            <FormBlock>
                <SoknadFormComponents.NumberInput
                    label={spørsmål.jobberNormaltTimer}
                    name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                    suffix={intlHelper(intl, `arbeidsforhold.antallTimer.suffix`)}
                    suffixStyle="text"
                    bredde="XS"
                    value={arbeidssituasjon?.jobberNormaltTimer || ''}
                    validate={validator.jobberNormaltTimer}
                />
            </FormBlock>
        </>
    );
};

export default ArbeidsformOgTimerFormPart;
