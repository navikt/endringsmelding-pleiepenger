import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, getTypedFormComponents, Time } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { InputDateString } from 'nav-datovelger/lib/types';
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
    endringsperiode: DateRange;
    onSubmit: (data: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

interface GjentagelseEnkeltdag {
    interval: GjentagelseInterval;
    intervalNth: number;
    tom?: Date;
}

export interface ArbeidstidEnkeltdagEndring {
    dagMedTid: DagMedTid;
    gjentagelse?: GjentagelseEnkeltdag;
}

enum FormFields {
    'tid' = 'tid',
    'gjenta' = 'gjenta',
    'interval' = 'interval',
    'stopGjentagelse' = 'stopGjentagelse',
    'stopDato' = 'stopDato',
}

enum GjentagelseInterval {
    hverUke = 'hverUke',
    hverAndreUke = 'hverAndreUke',
    hverTredjeUke = 'hverTredjeUke',
    hverFjerdeUke = 'hverFjerdeUke',
}

interface FormValues {
    [FormFields.tid]: InputTime;
    [FormFields.gjenta]: boolean;
    [FormFields.interval]: GjentagelseInterval;
    [FormFields.stopGjentagelse]: boolean;
    [FormFields.stopDato]: InputDateString;
}

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('arbeidstidEnkeltdagEdit');

const getNthFraGjentagelseInterval = (interval: GjentagelseInterval): number => {
    switch (interval) {
        case GjentagelseInterval.hverAndreUke:
            return 2;
        case GjentagelseInterval.hverTredjeUke:
            return 3;
        case GjentagelseInterval.hverFjerdeUke:
            return 4;
        default:
            return 1;
    }
};

const ArbeidstidEnkeltdagForm: React.FunctionComponent<Props> = ({
    dagMedTid: { dato, tid },
    tidOpprinnelig,
    arbeidsstedNavn,
    endringsperiode,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (value: FormValues) => {
        const gjentagelse: GjentagelseEnkeltdag | undefined =
            value.gjenta === true
                ? {
                      interval: value.interval,
                      intervalNth: getNthFraGjentagelseInterval(value.interval),
                      tom: datepickerUtils.getDateFromDateString(value.stopDato),
                  }
                : undefined;
        onSubmit({
            dagMedTid: {
                dato,
                tid: value.tid,
            },
            gjentagelse,
        });
    };

    const erHistorisk = dayjs(dato).isBefore(dateToday);
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;
    const dagNavn = dayjs(dato).format('dddd');
    const datoString = dateFormatter.extended(dato);
    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                Arbeidstid {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    initialValues={{
                        tid,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={({ values: { gjenta, stopGjentagelse } }) => {
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
                                <FormBlock margin="m">
                                    <FormComponents.Checkbox label="Gjenta endring" name={FormFields.gjenta} />
                                </FormBlock>
                                {gjenta === true && (
                                    <div style={{ paddingLeft: '1.5rem' }}>
                                        <FormBlock margin="m">
                                            <FormComponents.RadioGroup
                                                className="compactRadios"
                                                radios={[
                                                    {
                                                        label: `Hver ${dagNavn} etter ${datoString}`,
                                                        value: GjentagelseInterval.hverUke,
                                                    },
                                                    {
                                                        label: `Hver andre ${dagNavn} etter ${datoString}`,
                                                        value: GjentagelseInterval.hverAndreUke,
                                                    },
                                                    {
                                                        label: `Hver tredje ${dagNavn} etter ${datoString}`,
                                                        value: GjentagelseInterval.hverTredjeUke,
                                                    },
                                                    {
                                                        label: `Hver fjerde ${dagNavn} etter ${datoString}`,
                                                        value: GjentagelseInterval.hverFjerdeUke,
                                                    },
                                                ]}
                                                name={FormFields.interval}
                                            />
                                        </FormBlock>
                                        <FormBlock margin="m">
                                            <FormComponents.Checkbox
                                                label="Stop gjentagelse"
                                                name={FormFields.stopGjentagelse}
                                            />
                                        </FormBlock>
                                        {stopGjentagelse && (
                                            <FormBlock>
                                                <FormComponents.DatePicker
                                                    label="Dato for stopp"
                                                    minDate={dato}
                                                    maxDate={endringsperiode.to}
                                                    dayPickerProps={{
                                                        initialMonth: dato,
                                                    }}
                                                    name={FormFields.stopDato}
                                                />
                                            </FormBlock>
                                        )}
                                    </div>
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
