import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { DagMedTid, SoknadFormData, SoknadFormField, TidEnkeltdag } from '../../../types/SoknadFormData';
import OmsorgstilbudMånedInfo from './OmsorgstilbudMånedInfo';
import OmsorgstilbudMånedForm from './OmsorgstilbudMånedForm';
import { dateToISODate } from '../../../utils/dateUtils';
import { useFormikContext } from 'formik';
import { K9TidEnkeltdag } from '../../../types/K9Sak';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periodeIMåned: DateRange;
    utilgjengeligeDatoerIMåned?: Date[];
    endringsdato: Date;
    tidIOmsorgstilbudSak: K9TidEnkeltdag;
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
    const { setFieldValue } = useFormikContext<SoknadFormData>() || {};

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
                const handleOnEnkeltdagChange = (dagMedTid: DagMedTid) => {
                    const newValues = { ...data };
                    newValues[dateToISODate(dagMedTid.dato)] = dagMedTid.tid;
                    setFieldValue(SoknadFormField.omsorgstilbud_enkeltdager, newValues);
                    onAfterChange ? onAfterChange(newValues) : undefined;
                };

                return (
                    <OmsorgstilbudMånedInfo
                        periodeIMåned={periodeIMåned}
                        tidOmsorgstilbud={data}
                        tidOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                        månedTittelHeadingLevel={månedTittelHeadingLevel}
                        onEnkeltdagChange={handleOnEnkeltdagChange}
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
