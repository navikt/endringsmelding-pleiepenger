import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { getValidEnkeltdager, getValidTidEnkeltdag } from '../../utils/tidsbrukUtils';
import { TidPerDagValidator } from '../../validation/fieldValidations';
import TidUkerInput from '../tid-uker-input/TidUkerInput';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    tittel: JSX.Element;
    intro?: JSX.Element;
    periode: DateRange;
    tid: TidEnkeltdag;
    opprinneligTid?: TidEnkeltdag;
    utilgjengeligeDager?: Date[];
    tidPerDagValidator: TidPerDagValidator;
    onSubmit: (tid: TidEnkeltdag) => void;
    onCancel?: () => void;
}

enum FormField {
    tid = 'tid',
}
interface FormValues {
    [FormField.tid]: TidEnkeltdag;
}

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

export const cleanupTid = (values: FormValues): FormValues => {
    const cleanedTid: TidEnkeltdag = {};
    Object.keys(values[FormField.tid]).forEach((tidKey) => {
        cleanedTid[tidKey] = getValidTidEnkeltdag(values[FormField.tid][tidKey]);
    });
    return {
        tid: cleanedTid,
    };
};

const TidKalenderForm = ({
    periode,
    tid,
    opprinneligTid,
    tittel,
    intro,
    utilgjengeligeDager = [],
    tidPerDagValidator,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    if (dayjs(periode.from).isAfter(periode.to, 'day')) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tid = {} }: Partial<FormValues>) => {
        onSubmit(getValidEnkeltdager(tid));
    };

    return (
        <Normaltekst tag="div">
            <Form.FormikWrapper
                initialValues={{ tid }}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeValidationSummary={true}
                            includeButtons={false}
                            cleanup={cleanupTid}
                            formFooter={
                                <FormBlock margin="l">
                                    <Knapperad align="left">
                                        <Knapp htmlType="submit" type="hoved">
                                            <FormattedMessage id="tidKalenderForm.ok.label" />
                                        </Knapp>
                                        <Knapp htmlType="button" type="standard" onClick={onCancel}>
                                            <FormattedMessage id="tidKalenderForm.avbryt.label" />
                                        </Knapp>
                                    </Knapperad>
                                </FormBlock>
                            }>
                            <Systemtittel tag="h1">{tittel}</Systemtittel>
                            {intro ? <Box margin="l">{intro}</Box> : undefined}

                            {utilgjengeligeDager.length > 0 && (
                                <Box margin="m">
                                    <ExpandableInfo title={`Hvorfor er ikke alle dagene nedenfor tilgjengelig?`}>
                                        Her kommer en forklaring på hvorfor noen dager ikke er tilgjengelig nedenfor.
                                        Altså dager som det ikke er søkt om. Dager det ikke er søkt om i{' '}
                                        {dayjs(periode.from).format('MMMM YYYY')}:
                                        <ul>
                                            {utilgjengeligeDager.map((d) => (
                                                <li key={d.toString()}>
                                                    <span className={'--capitalize'}>{dayjs(d).format('dddd DD')}</span>
                                                    .
                                                </li>
                                            ))}
                                        </ul>
                                    </ExpandableInfo>
                                </Box>
                            )}
                            <ResponsivePanel>
                                <TidUkerInput
                                    fieldName={FormField.tid}
                                    periode={periode}
                                    opprinneligTid={opprinneligTid}
                                    utilgjengeligeDager={utilgjengeligeDager}
                                    brukPanel={false}
                                    tidPerDagValidator={tidPerDagValidator}
                                />
                            </ResponsivePanel>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

export default TidKalenderForm;
