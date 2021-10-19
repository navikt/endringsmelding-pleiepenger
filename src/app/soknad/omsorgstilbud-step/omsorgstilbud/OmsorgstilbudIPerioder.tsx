import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { SoknadFormField, TidEnkeltdag } from '../../../types/SoknadFormData';
import { getMonthsInDateRange } from '../../../utils/dateUtils';
import SoknadFormComponents from '../../SoknadFormComponents';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import flatten from 'lodash.flatten';

interface Props {
    endringsdato: Date;
    endringsperiode: DateRange;
    søknadsperioder: DateRange[];
    tidIOmsorgstilbudSak: TidEnkeltdag;
    onOmsorgstilbudChanged?: (omsorgsdager: TidEnkeltdag) => void;
}

type SøknadsperiodeMåned = {
    [yearMonthKey: string]: DateRange[];
};

export const getMånederMedSøknadsperioder = (søknadsperioder: DateRange[]): SøknadsperiodeMåned => {
    const måneder: SøknadsperiodeMåned = {};
    flatten(søknadsperioder.map((periode) => getMonthsInDateRange(periode))).forEach((periode) => {
        const key = getYearMonthKey(periode.from);
        måneder[key] = måneder[key] ? [...måneder[key], periode] : [periode];
    });
    return måneder;
};

export const getDatesIDateRange = ({ from, to }: DateRange): Date[] => {
    const dates: Date[] = [];
    let currentDate = dayjs(from);
    do {
        dates.push(currentDate.toDate());
        currentDate = currentDate.add(1, 'day');
    } while (dayjs(currentDate).isSameOrBefore(to));
    return dates;
};

export const getUtilgjengeligeDager = (perioder: DateRange[]): Date[] => {
    if (perioder.length === 1) {
        return [];
    }
    const utilgjengeligeDager: Date[] = [];

    perioder.forEach((periode, index) => {
        if (index === 0) {
            return;
        }
        const forrigePeriode = perioder[index - 1];
        const dagerMellom = dayjs(periode.from).diff(forrigePeriode.to, 'days');
        if (dagerMellom > 0) {
            const dates = getDatesIDateRange({
                from: dayjs(forrigePeriode.to).add(1, 'day').toDate(),
                to: dayjs(periode.from).subtract(1, 'day').toDate(),
            });
            utilgjengeligeDager.push(...dates);
        }
    });
    return utilgjengeligeDager;
};

const getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');

const OmsorgstilbudIPerioder: React.FunctionComponent<Props> = ({
    endringsdato,
    // endringsperiode,
    søknadsperioder,
    tidIOmsorgstilbudSak,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const måneder = getMånederMedSøknadsperioder(søknadsperioder);

    return (
        <SoknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${SoknadFormField.omsorgstilbud}_dager` as any}
            legend="Åpne den eller de månedene du ønsker å endre. Du kan legge til eller fjerne tid"
            description={
                <ExpandableInfo title="Er det én eller flere måneder som ikke vises her? ">TODO: info</ExpandableInfo>
            }
            tag="div"
            // validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}
        >
            {Object.keys(måneder).map((key) => {
                const måned = måneder[key];
                const periode = {
                    from: måned[0].from,
                    to: måned[måned.length - 1].to,
                };
                const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                return (
                    <FormBlock margin="l" key={dayjs(periode.from).format('MM.YYYY')}>
                        <OmsorgstilbudInfoAndDialog
                            name={SoknadFormField.omsorgstilbud_enkeltdager}
                            periode={periode}
                            utilgjengeligeDager={getUtilgjengeligeDager(måned)}
                            endringsdato={endringsdato}
                            tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
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
                    </FormBlock>
                );
            })}
        </SoknadFormComponents.InputGroup>
    );
};

export default OmsorgstilbudIPerioder;
