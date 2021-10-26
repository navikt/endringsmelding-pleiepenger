import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { K9ArbeidsgiverArbeidstid } from '../../../types/K9Sak';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getUtilgjengeligeDagerIMåned } from '../../../utils/utilgjengeligeDagerUtils';
import ArbeidstidMånedForm from './ArbeidstidMånedForm';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    formFieldName: FieldNames;
    labels: ModalFormAndInfoLabels;
    periodeIMåned: DateRange;
    utilgjengeligeDager?: Date[];
    endringsdato: Date;
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
    månedTittelHeadingLevel?: number;
    onAfterChange?: (tid: TidEnkeltdag) => void;
}

function ArbeidstidFormAndInfo<FieldNames>({
    formFieldName,
    periodeIMåned,
    labels,
    endringsdato,
    arbeidstidArbeidsgiverSak,
    utilgjengeligeDager = [],
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(periodeIMåned.to).isBefore(endringsdato, 'day');
    const alleUtilgjengeligeDager = getUtilgjengeligeDagerIMåned(utilgjengeligeDager, periodeIMåned);

    return (
        <FormikModalFormAndInfo<FieldNames, TidEnkeltdag, ValidationError>
            name={formFieldName}
            validate={validate}
            labels={labels}
            renderEditButtons={false}
            renderDeleteButton={false}
            dialogClassName={'calendarDialog'}
            wrapInfoInPanel={false}
            defaultValue={{}}
            formRenderer={({ onSubmit, onCancel, data = {} }) => {
                return (
                    <ArbeidstidMånedForm
                        periodeIMåned={periodeIMåned}
                        arbeidstid={data}
                        arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                        utilgjengeligeDager={alleUtilgjengeligeDager}
                        erHistorisk={erHistorisk}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                return (
                    <ArbeidstidMånedInfo
                        periodeIMåned={periodeIMåned}
                        tidArbeidstid={data}
                        arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                        utilgjengeligeDager={alleUtilgjengeligeDager}
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

export default ArbeidstidFormAndInfo;
