import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, Time } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { useIntl } from 'react-intl';
import { InputTime } from '../../types';
import { DagMedTid } from '../../types/SoknadFormData';
import dateFormatter from '../../utils/dateFormatterUtils';
import { timeHasSameDuration } from '../../utils/dateUtils';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';

interface Props {
    dagMedTid: DagMedTid;
    tidOpprinnelig: Time;
    arbeidsstedNavn: string;
    onSubmit: (tid: DagMedTid) => void;
    onCancel: () => void;
}

enum FormFields {
    'tid' = 'tid',
}

interface FormValues {
    [FormFields.tid]: InputTime;
}

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('arbeidstidEnkeltdagEdit');

const ArbeidstidEnkeltdagForm: React.FunctionComponent<Props> = ({
    dagMedTid: { dato, tid },
    tidOpprinnelig,
    arbeidsstedNavn,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (value: FormValues) => {
        onSubmit({
            dato,
            tid: value.tid,
        });
    };

    const erHistorisk = dayjs(dato).isBefore(dateToday);
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;
    return (
        <div>
            <Undertittel className={bem.element('tittel')}>Arbeidstid {dateFormatter.full(dato)}</Undertittel>
            <FormBlock>
                <FormComponents.FormikWrapper
                    initialValues={{
                        tid,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={() => {
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidEnkeltdag')}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Lagre"
                                cancelButtonLabel="Avbryt">
                                <FormComponents.TimeInput
                                    name={FormFields.tid}
                                    label={`Hvor mye ${
                                        erHistorisk ? 'jobbet du' : 'skal du jobbe'
                                    } hos ${arbeidsstedNavn} ${dateFormatter.full(dato)}?`}
                                    validate={getTimeValidator({ max: { hours: 24, minutes: 60 } })}
                                    timeInputLayout={{ justifyContent: 'left', compact: false, direction: 'vertical' }}
                                />
                                {erEndret && (
                                    <p>
                                        Endret fra <FormattedTimeText time={tidOpprinnelig} fullText={true} />
                                    </p>
                                )}
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export default ArbeidstidEnkeltdagForm;
