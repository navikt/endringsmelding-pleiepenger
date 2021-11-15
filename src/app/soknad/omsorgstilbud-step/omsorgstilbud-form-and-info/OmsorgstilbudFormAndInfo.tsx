import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import OmsorgstilbudMånedInfo from './OmsorgstilbudMånedInfo';
import OmsorgstilbudMånedForm from './OmsorgstilbudMånedForm';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periodeIMåned: DateRange;
    utilgjengeligeDatoerIMåned?: Date[];
    endringsdato: Date;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    månedTittelHeadingLevel?: number;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

function OmsorgstilbudFormAndInfo<FieldNames>({
    name,
    periodeIMåned,
    labels,
    tidIOmsorgstilbudSak,
    utilgjengeligeDatoerIMåned = [],
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    return (
        <FormikModalFormAndInfo<FieldNames, TidEnkeltdag, ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'calendarDialog'}
            wrapInfoInPanel={false}
            wrapInfoInFieldset={false}
            defaultValue={{}}
            useFastField={true}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <OmsorgstilbudMånedForm
                        periodeIMåned={periodeIMåned}
                        tidOmsorgstilbud={data}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                return (
                    <OmsorgstilbudMånedInfo
                        periodeIMåned={periodeIMåned}
                        tidOmsorgstilbud={data}
                        tidOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                        månedTittelHeadingLevel={månedTittelHeadingLevel}
                        onEdit={onEdit}
                        editLabel={labels.editLabel}
                        addLabel={labels.addLabel}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudFormAndInfo;
