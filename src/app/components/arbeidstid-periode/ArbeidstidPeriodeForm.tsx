import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Undertittel } from 'nav-frontend-typografi';
import { InputDateString } from 'nav-datovelger/lib/types';
import {
    getDateRangeValidator,
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

interface Props {
    arbeidsstedNavn: string;
    endringsperiode: DateRange;
    onSubmit: (data: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

export type ArbeidstidPeriodeData = {
    fom: Date;
    tom: Date;
};

enum FormFields {
    'fom' = 'fom',
    'tom' = 'tom',
    'skalJobbe' = 'skalJobbe',
    'tidFasteDager' = 'tidFasteDager',
}

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.skalJobbe]: YesOrNo;
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

const PeriodeSpørsmål = ({ periode, endringsperiode }: { periode?: DateRange; endringsperiode: DateRange }) => (
    <FormComponents.DateIntervalPicker
        legend="Hvilken periode ønsker du å endre?"
        validate={() => {
            return getRequiredFieldValidator()(periode);
        }}
        fromDatepickerProps={{
            label: 'Fra og med',
            name: FormFields.fom,
            disableWeekend: true,
            fullScreenOnMobile: true,
            minDate: endringsperiode.from,
            maxDate: endringsperiode.to,
            validate: getDateRangeValidator({ required: true, onlyWeekdays: true }).validateFromDate,
        }}
        toDatepickerProps={{
            label: 'Til og med',
            name: FormFields.tom,
            disableWeekend: true,
            fullScreenOnMobile: true,
            minDate: endringsperiode.from,
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
const ArbeidstidPeriodeForm: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    endringsperiode,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (values: FormValues) => {
        console.log(values);
        onSubmit({
            fom: new Date(),
            tom: new Date(),
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
                    renderForm={({ values: { skalJobbe, fom, tom, tidFasteDager } }) => {
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
                                        <TidPerDagSpørsmål tidFasteDager={tidFasteDager} />
                                    </FormBlock>
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
