import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import Knapp from 'nav-frontend-knapper';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom } from '../../../utils/tidsbrukUtils';
import { getTidIOmsorgValidator } from '../../../validation/validateOmsorgstilbudFields';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    periode: DateRange;
    søknadsdato: Date;
    skjulTommeDagerIListe?: boolean;
    onAfterChange?: (omsorgsdager: TidEnkeltdag) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    periode,
    labels,
    søknadsdato,
    skjulTommeDagerIListe,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const erHistorisk = dayjs(periode.to).isBefore(søknadsdato, 'day');
    const intl = useIntl();
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
                        tid={data}
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
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data, onEdit }) => {
                const omsorgsdager = getDagerMedTidITidsrom(data, periode);
                const tittelIdForAriaDescribedBy = `mndTittel_${dayjs(periode.from).format('MM_YYYY')}`;
                const måned = omsorgsdager.length > 0 ? omsorgsdager[0].dato : periode.from;
                const mndTittelPart = intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
                    ukeOgÅr: dayjs(periode.from).format('MMMM YYYY'),
                });
                return (
                    <>
                        <Ekspanderbartpanel
                            tittel={
                                <>
                                    <Undertittel>{mndTittelPart}</Undertittel>
                                    <Box margin="m">
                                        <Normaltekst>Åpne for å se og endre tid i omsorgstilbud</Normaltekst>
                                    </Box>
                                </>
                            }>
                            <ResponsivePanel style={{ padding: '1rem' }}>
                                <TidsbrukKalender
                                    brukEtikettForInnhold={false}
                                    måned={måned}
                                    periode={periode}
                                    dager={omsorgsdager}
                                    visSomListe={false}
                                    skjulTommeDagerIListe={skjulTommeDagerIListe}
                                    tidRenderer={(tid) => {
                                        return (
                                            <strong>
                                                <FormattedTimeText time={tid} decimal={false} />
                                            </strong>
                                        );
                                    }}
                                />
                                <FormBlock margin="l">
                                    <Knapp
                                        htmlType="button"
                                        mini={true}
                                        onClick={() => onEdit(data)}
                                        aria-describedby={tittelIdForAriaDescribedBy}>
                                        {omsorgsdager.length === 0 ? labels.addLabel : labels.editLabel}
                                    </Knapp>
                                </FormBlock>
                            </ResponsivePanel>
                        </Ekspanderbartpanel>
                    </>
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;
