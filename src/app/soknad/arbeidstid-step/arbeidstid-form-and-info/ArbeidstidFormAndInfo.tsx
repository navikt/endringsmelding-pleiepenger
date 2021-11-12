import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { K9ArbeidstidInfo } from '../../../types/K9Sak';
import { DagMedTid, SoknadFormData, TidEnkeltdag } from '../../../types/SoknadFormData';
import ArbeidstidMånedForm from './ArbeidstidMånedForm';
import ArbeidstidMånedInfo from './ArbeidstidMånedInfo';
import { datoErHistorisk } from '../../../utils/tidsbrukUtils';
import { useFormikContext } from 'formik';
import { dateToISODate } from '../../../utils/dateUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    formFieldName: FieldNames;
    arbeidsstedNavn: string;
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
    arbeidsstedNavn,
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
    const { setFieldValue } = useFormikContext<SoknadFormData>() || {};

    const renderForm: ModalFormRenderer<TidEnkeltdag> = ({ onSubmit, onCancel, data = {} }) => (
        <ArbeidstidMånedForm
            arbeidsstedNavn={arbeidsstedNavn}
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
        const handleOnEnkeltdagChange = (dagMedTid: DagMedTid) => {
            const newValues = { ...data };
            newValues[dateToISODate(dagMedTid.dato)] = dagMedTid.tid;
            setFieldValue(formFieldName as any, newValues);
            onAfterChange ? onAfterChange(newValues) : undefined;
        };

        return (
            <ArbeidstidMånedInfo
                arbeidsstedNavn={arbeidsstedNavn}
                periodeIMåned={periodeIMåned}
                tidArbeidstid={data}
                arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                utilgjengeligeDatoer={utilgjengeligeDatoerIMåned}
                månedTittelHeadingLevel={månedTittelHeadingLevel}
                onRequestEdit={onEdit}
                onEnkeltdagChange={handleOnEnkeltdagChange}
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
