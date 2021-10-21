import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getUtilgjengeligeDagerIMåned } from '../../../utils/utilgjengeligeDagerUtils';
import OmsorgstilbudMånedInfo, { OmsorgstilbudIPeriodemånedTittelHeadingLevel } from './OmsorgstilbudMånedInfo';
import OmsorgstilbudMånedForm from './OmsorgstilbudMånedForm';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    måned: DateRange;
    utilgjengeligeDager?: Date[];
    endringsdato: Date;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    månedTittelHeadingLevel?: OmsorgstilbudIPeriodemånedTittelHeadingLevel;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

function OmsorgstilbudFormAndInfo<FieldNames>({
    name,
    måned,
    labels,
    endringsdato,
    tidIOmsorgstilbudSak,
    utilgjengeligeDager = [],
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(måned.to).isBefore(endringsdato, 'day');
    const alleUtilgjengeligeDager = getUtilgjengeligeDagerIMåned(utilgjengeligeDager, måned);
    return (
        <FormikModalFormAndInfo<FieldNames, TidEnkeltdag, ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'calendarDialog'}
            wrapInfoInPanel={false}
            defaultValue={{}}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <OmsorgstilbudMånedForm
                        måned={måned}
                        tidOmsorgstilbud={data}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDager={alleUtilgjengeligeDager}
                        erHistorisk={erHistorisk}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                return (
                    <OmsorgstilbudMånedInfo
                        tidOmsorgstilbud={data}
                        tidOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        månedTittelHeadingLevel={månedTittelHeadingLevel}
                        onEdit={onEdit}
                        editLabel={labels.editLabel}
                        addLabel={labels.addLabel}
                        måned={måned}
                        utilgjengeligeDager={alleUtilgjengeligeDager}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudFormAndInfo;
