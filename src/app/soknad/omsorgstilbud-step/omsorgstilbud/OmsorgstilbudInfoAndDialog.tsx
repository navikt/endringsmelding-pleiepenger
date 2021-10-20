import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getTidIOmsorgValidator } from '../../../validation/validateOmsorgstilbudFields';
import OmsorgstilbudIPeriode, { OmsorgstilbudIPeriodemånedTittelHeadingLevel } from './OmsorgstilbudIPeriode';
import { getTidEnkeltdagerInnenforPeriode } from '../../../utils/tidsbrukUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periode: DateRange;
    utilgjengeligeDager?: Date[];
    endringsdato: Date;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    skjulTommeDagerIListe?: boolean;
    månedTittelHeadingLevel?: OmsorgstilbudIPeriodemånedTittelHeadingLevel;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

const cleanupTidIPeriode = (
    alleTider: TidEnkeltdag,
    tidIPeriode: TidEnkeltdag,
    tidOpprinnelig: TidEnkeltdag
): TidEnkeltdag => {
    const keysToRemove: string[] = [];
    Object.keys(tidIPeriode).forEach((key) => {
        const tid = tidIPeriode[key];
        const duration = timeToIso8601Duration(tid);
        const opprinneligDuration = tidOpprinnelig[key] ? timeToIso8601Duration(tidOpprinnelig[key]) : undefined;
        if (duration === 'PT0H0M' && opprinneligDuration === undefined) {
            keysToRemove.push(key);
            console.log({ tid, duration, opprinneligDuration });
        }
    });
    const cleanedTid = { ...alleTider, ...tidIPeriode };
    keysToRemove.forEach((key) => {
        delete cleanedTid[key];
    });
    return cleanedTid;
};

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    periode,
    labels,
    endringsdato,
    skjulTommeDagerIListe,
    tidIOmsorgstilbudSak,
    utilgjengeligeDager,
    månedTittelHeadingLevel,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(periode.to).isBefore(endringsdato, 'day');
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
                    <TidKalenderForm
                        periode={periode}
                        utilgjengeligeDager={utilgjengeligeDager}
                        tid={getTidEnkeltdagerInnenforPeriode(data, periode)}
                        opprinneligTid={tidIOmsorgstilbudSak}
                        tittel={
                            <FormattedMessage
                                id="omsorgstilbud.form.tittel"
                                values={{ måned: dayjs(periode.from).format('MMMM YYYY') }}
                            />
                        }
                        intro={
                            <>
                                <p>
                                    <FormattedMessage
                                        id={
                                            erHistorisk
                                                ? 'omsorgstilbud.form.intro_fortid.1'
                                                : 'omsorgstilbud.form.intro.1'
                                        }
                                    />
                                </p>
                                <p>
                                    <strong>
                                        <FormattedMessage id="omsorgstilbud.form.intro.2" />
                                    </strong>
                                </p>
                            </>
                        }
                        tidPerDagValidator={getTidIOmsorgValidator}
                        onSubmit={(values) => {
                            onSubmit(
                                cleanupTidIPeriode(
                                    data,
                                    values,
                                    getTidEnkeltdagerInnenforPeriode(tidIOmsorgstilbudSak, periode)
                                )
                            );
                        }}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                return (
                    <OmsorgstilbudIPeriode
                        tidOmsorgstilbud={data}
                        tidOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        månedTittelHeadingLevel={månedTittelHeadingLevel}
                        onEdit={onEdit}
                        editLabel={labels.editLabel}
                        addLabel={labels.addLabel}
                        periode={periode}
                        utilgjengeligeDager={utilgjengeligeDager}
                        skjulTommeDagerIListe={skjulTommeDagerIListe}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;
