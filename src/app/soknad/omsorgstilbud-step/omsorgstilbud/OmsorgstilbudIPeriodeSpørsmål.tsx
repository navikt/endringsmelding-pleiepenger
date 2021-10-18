import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { SoknadFormField, TidEnkeltdag } from '../../../types/SoknadFormData';
import { getMonthsInDateRange } from '../../../utils/dateUtils';
import SoknadFormComponents from '../../SoknadFormComponents';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    tidIOmsorgstilbud: TidEnkeltdag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudIPeriodeSpørsmål: React.FunctionComponent<Props> = ({
    periode,
    // tidIOmsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();

    return (
        <SoknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${SoknadFormField.omsorgstilbud}_dager` as any}
            tag="div"
            // validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}
        >
            {getMonthsInDateRange(periode).map((periode) => {
                const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                return (
                    <div key={dayjs(periode.from).format('MM.YYYY')} className="omsorgstilbudKalender__mnd">
                        <OmsorgstilbudInfoAndDialog
                            name={SoknadFormField.omsorgstilbud_enkeltdager}
                            periode={periode}
                            søknadsdato={søknadsdato}
                            skjulTommeDagerIListe={true}
                            onAfterChange={onOmsorgstilbudChanged}
                            labels={{
                                addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                                    periode: mndOgÅr,
                                }),
                                deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                                    periode: mndOgÅr,
                                }),
                                editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                                    periode: mndOgÅr,
                                }),
                                modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                    periode: mndOgÅr,
                                }),
                            }}
                        />
                    </div>
                );
            })}
        </SoknadFormComponents.InputGroup>
    );
};

export default OmsorgstilbudIPeriodeSpørsmål;
