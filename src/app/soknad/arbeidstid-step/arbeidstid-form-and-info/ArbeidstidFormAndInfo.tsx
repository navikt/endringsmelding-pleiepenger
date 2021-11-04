import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { K9ArbeidstidInfo } from '../../../types/K9Sak';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import ArbeidstidMånedForm from './ArbeidstidMånedForm';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';
import { datoErHistorisk } from '../../../utils/tidsbrukUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    formFieldName: FieldNames;
    labels: ModalFormAndInfoLabels;
    periodeIMåned: DateRange;
    utilgjengeligeDatoerIMåned?: Date[];
    endringsdato: Date;
    arbeidstidArbeidsgiverSak: K9ArbeidstidInfo;
    månedTittelHeadingLevel?: number;
    onAfterChange?: (tid: TidEnkeltdag) => void;
}

declare type ModalFormRenderer<DataType> = (props: {
    data?: DataType;
    onSubmit: (data: DataType) => void;
    onCancel: () => void;
}) => React.ReactNode;

declare type InfoRenderer<DataType> = (props: {
    data: DataType;
    onEdit: (data: DataType) => void;
    onDelete: (data: DataType) => void;
}) => React.ReactNode;

function ArbeidstidFormAndInfo<FieldNames>({
    formFieldName,
    periodeIMåned,
    labels,
    endringsdato,
    arbeidstidArbeidsgiverSak,
    utilgjengeligeDatoerIMåned = [],
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = datoErHistorisk(periodeIMåned.to, endringsdato);

    const renderForm: ModalFormRenderer<TidEnkeltdag> = ({ onSubmit, onCancel, data = {} }) => (
        <ArbeidstidMånedForm
            periodeIMåned={periodeIMåned}
            arbeidstid={data}
            arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
            utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
            erHistorisk={erHistorisk}
            onCancel={onCancel}
            onSubmit={onSubmit}
        />
    );

    const renderInfo: InfoRenderer<TidEnkeltdag> = ({ data, onEdit }) => {
        return (
            <ArbeidstidMånedInfo
                periodeIMåned={periodeIMåned}
                tidArbeidstid={data}
                arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                månedTittelHeadingLevel={månedTittelHeadingLevel}
                onEdit={onEdit}
                editLabel={labels.editLabel}
                addLabel={labels.addLabel}
            />
        );
    };

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
            useFastField={true}
            formRenderer={renderForm}
            infoRenderer={renderInfo}
            onAfterChange={onAfterChange}
            wrapInfoInFieldset={false}
        />
    );
}

export default ArbeidstidFormAndInfo;
