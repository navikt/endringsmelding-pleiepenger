import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Undertittel } from 'nav-frontend-typografi';
import { InputDateString } from 'nav-datovelger/lib/types';
import {
    getDateRangeValidator,
    getNumberValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import TidFasteDagerInput from '../tid-faste-dager-input/TidFasteDagerInput';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { getArbeidstimerFastDagValidator, validateFasteArbeidstimerIUke } from '../../validation/fieldValidations';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { TidFasteDager } from '../../types/SoknadFormData';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';

interface Props {
    arbeidsstedNavn: string;
    endringsperiode: DateRange;
    onSubmit: (data: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

enum HvordanOppgiArbeidstidType {
    prosent = 'prosent',
    timer = 'timer',
    prosentPerUkedag = 'prosentPerUkedag',
    timerPerUkedag = 'timerPerUkedag',
}

export type ArbeidstidPeriodeData = {
    fom: Date;
    tom: Date;
    skalJobbe: boolean;
    tidFasteDager?: TidFasteDager;
};

enum FormFields {
    'fom' = 'fom',
    'tom' = 'tom',
    'skalJobbe' = 'skalJobbe',
    'skalJobbeSomVanlig' = 'skalJobbeSomVanlig',
    'tidFasteDager' = 'tidFasteDager',
    'prosent' = 'prosent',
    'timerPerDag' = 'timerPerDag',
    'hvordanOppgiArbeidstid' = 'hvordanOppgiArbeidstid',
}

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.skalJobbe]: YesOrNo;
    [FormFields.skalJobbeSomVanlig]: YesOrNo;
    [FormFields.hvordanOppgiArbeidstid]: HvordanOppgiArbeidstidType;
    [FormFields.prosent]: string;
    [FormFields.timerPerDag]: InputTime;
    [FormFields.tidFasteDager]?: TidFasteDager;
}

const initialFormValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('arbeidstidEnkeltdagEdit');

const SkalJobbeSpørsmål = () => (
    <FormComponents.YesOrNoQuestion
        name={FormFields.skalJobbe}
        legend="Skal du jobbe i denne perioden?"
        validate={getYesOrNoValidator()}
    />
);

const SkalJobbeSomVanligSpørsmål = () => (
    <FormComponents.YesOrNoQuestion
        name={FormFields.skalJobbeSomVanlig}
        legend="Hvordan skal du jobbe denne perioden?"
        labels={{ no: 'Mindre enn vanlig', yes: 'Som vanlig' }}
        validate={getRequiredFieldValidator()}
    />
);

const PeriodeSpørsmål = ({ periode, endringsperiode }: { periode?: DateRange; endringsperiode: DateRange }) => (
    <FormComponents.DateIntervalPicker
        legend="Hvilken periode ønsker du å endre?"
        fromDatepickerProps={{
            label: 'Fra og med',
            name: FormFields.fom,
            disableWeekend: true,
            fullScreenOnMobile: true,
            minDate: endringsperiode.from,
            maxDate: periode?.to || endringsperiode.to,
            validate: getDateRangeValidator({ required: true, onlyWeekdays: true }).validateFromDate,
        }}
        toDatepickerProps={{
            label: 'Til og med',
            name: FormFields.tom,
            disableWeekend: true,
            fullScreenOnMobile: true,
            minDate: periode?.from || endringsperiode.from,
            maxDate: endringsperiode.to,
            validate: getDateRangeValidator({ required: true }).validateToDate,
        }}
    />
);

const TidPerDagSpørsmål = ({ tidFasteDager }: { tidFasteDager?: TidFasteDager }) => (
    <SoknadFormComponents.InputGroup
        legend={
            'Oppgi hvor mye du jobber disse ukedagene. Det er viktig at du fyller ut timer og minutter på riktig dag, altså den dagen du faktisk er på jobb.'
        }
        validate={() => validateFasteArbeidstimerIUke(tidFasteDager)}
        name={'fasteDager_gruppe' as any}
        description={
            <ExpandableInfo title={'Hva betyr dette?'}>
                <p>Du skal bare fylle ut på den ukedagen du faktisk skal jobbe.</p>
                <p>
                    Hvis du for eksempel skal jobbe 2 timer mandag og 4 timer fredag, må du fylle ut 2 timer for mandag
                    og 4 timer for fredag. Du skal altså ikke fylle ut 6 timer på en og samme dag.
                </p>
            </ExpandableInfo>
        }>
        <TidFasteDagerInput name={FormFields.tidFasteDager} validator={getArbeidstimerFastDagValidator} />
    </SoknadFormComponents.InputGroup>
);

const HvordanOppgiArbeidstidSpørsmål = () => (
    <FormComponents.RadioPanelGroup
        name={FormFields.hvordanOppgiArbeidstid}
        legend="Hvordan ønsker du å oppgi hvor mye du skal jobbe disse dagene?"
        radios={[
            {
                label: 'I prosent for hele perioden',
                value: HvordanOppgiArbeidstidType.prosent,
            },
            {
                label: 'I prosent per ukedag',
                value: HvordanOppgiArbeidstidType.prosentPerUkedag,
            },
            {
                label: 'Timer og minutter likt for alle dager i perioden',
                value: HvordanOppgiArbeidstidType.timer,
            },
            {
                label: 'Timer og minutter per ukedag',
                value: HvordanOppgiArbeidstidType.timerPerUkedag,
            },
        ]}
        validate={getRequiredFieldValidator()}
    />
);

const ProsentSpørsmål = () => (
    <FormComponents.NumberInput
        name={FormFields.prosent}
        bredde="XS"
        maxLength={3}
        label="Hvor mange prosent skal du jobbe i denne perioden?"
        validate={getNumberValidator({ min: 0, max: 99 })}
        description={
            <ExpandableInfo title="Viktig når du oppgir arbeidstid i prosent">
                Når du oppgir i prosent, betyr dette at.
            </ExpandableInfo>
        }
    />
);

const TimerSpørsmål = () => (
    <>
        <FormComponents.TimeInput
            name={FormFields.timerPerDag}
            label="Hvor mange timer skal du jobbe hver dag i denne perioden?"
            validate={getTimeValidator({ max: { hours: 24, minutes: 59 } })}
            description={
                <ExpandableInfo title="Viktig når du oppgir arbeidstid i likt antall timer per dag">
                    Når du oppgir i prosent, betyr dette at.
                </ExpandableInfo>
            }
        />
    </>
);

const ArbeidstidPeriodeForm: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    endringsperiode,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (values: FormValues) => {
        const fom = datepickerUtils.getDateFromDateString(values.fom);
        const tom = datepickerUtils.getDateFromDateString(values.tom);

        if (!fom || !tom) {
            throw new Error('ArbeidstidPeriodeForm. Ugyldig fom/tom ');
        }

        onSubmit({
            fom,
            tom,
            skalJobbe: values.skalJobbe === YesOrNo.YES,
            tidFasteDager: values.tidFasteDager,
        });
    };

    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                Endre arbeidstimer - {arbeidsstedNavn}
            </Undertittel>
            <FormBlock margin="xl">
                <FormComponents.FormikWrapper
                    initialValues={initialFormValues}
                    onSubmit={onValidSubmit}
                    renderForm={({
                        values: { skalJobbe, fom, tom, hvordanOppgiArbeidstid, skalJobbeSomVanlig, tidFasteDager },
                    }) => {
                        const from = datepickerUtils.getDateFromDateString(fom);
                        const to = datepickerUtils.getDateFromDateString(tom);
                        const periode = from && to ? { from, to } : undefined;
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidPeriode')}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Ok"
                                cancelButtonLabel="Avbryt">
                                <FormBlock>
                                    <PeriodeSpørsmål periode={periode} endringsperiode={endringsperiode} />
                                </FormBlock>
                                <FormBlock>
                                    <SkalJobbeSpørsmål />
                                </FormBlock>
                                {skalJobbe === YesOrNo.YES && (
                                    <FormBlock>
                                        <SkalJobbeSomVanligSpørsmål />
                                    </FormBlock>
                                )}
                                {skalJobbeSomVanlig === YesOrNo.NO && (
                                    <>
                                        <FormBlock>
                                            <HvordanOppgiArbeidstidSpørsmål />
                                        </FormBlock>
                                        {hvordanOppgiArbeidstid === HvordanOppgiArbeidstidType.prosent && (
                                            <FormBlock>
                                                <ProsentSpørsmål />
                                            </FormBlock>
                                        )}
                                        {hvordanOppgiArbeidstid === HvordanOppgiArbeidstidType.timer && (
                                            <FormBlock>
                                                <TimerSpørsmål />
                                            </FormBlock>
                                        )}
                                        {hvordanOppgiArbeidstid === HvordanOppgiArbeidstidType.timerPerUkedag && (
                                            <FormBlock>
                                                <TidPerDagSpørsmål tidFasteDager={tidFasteDager} />
                                            </FormBlock>
                                        )}
                                    </>
                                )}
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export default ArbeidstidPeriodeForm;
