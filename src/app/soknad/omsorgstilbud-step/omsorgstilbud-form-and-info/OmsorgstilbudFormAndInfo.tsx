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
import OmsorgstilbudMånedInfo, { OmsorgstilbudIPeriodemånedTittelHeadingLevel } from './OmsorgstilbudMånedInfo';
import OmsorgstilbudMånedForm from './OmsorgstilbudMånedForm';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periodeIMåned: DateRange;
    utilgjengeligeDager?: Date[];
    endringsdato: Date;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    månedTittelHeadingLevel?: OmsorgstilbudIPeriodemånedTittelHeadingLevel;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

function OmsorgstilbudFormAndInfo<FieldNames>({
    name,
    periodeIMåned,
    labels,
    endringsdato,
    tidIOmsorgstilbudSak,
    utilgjengeligeDager = [],
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(periodeIMåned.to).isBefore(endringsdato, 'day');

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
                        periodeIMåned={periodeIMåned}
                        tidOmsorgstilbud={data}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDager={utilgjengeligeDager}
                        erHistorisk={erHistorisk}
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
                        utilgjengeligeDager={utilgjengeligeDager}
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
