import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import {
    dateIsWeekDay,
    getDateRangeFromDateRanges,
    getMonthsInDateRange,
    getYearsInDateRanges,
} from '../../utils/dateUtils';
import SoknadFormComponents from '../SoknadFormComponents';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
// import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import flatten from 'lodash.flatten';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    endringsdato: Date;
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

export const getDatesInDateRange = ({ from, to }: DateRange): Date[] => {
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
            const dates = getDatesInDateRange({
                from: dayjs(forrigePeriode.to).add(1, 'day').toDate(),
                to: dayjs(periode.from).subtract(1, 'day').toDate(),
            }).filter(dateIsWeekDay);
            utilgjengeligeDager.push(...dates);
        }
    });
    return utilgjengeligeDager;
};

const getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');

const OmsorgstilbudMånedListe: React.FunctionComponent<Props> = ({
    endringsdato,
    søknadsperioder,
    tidIOmsorgstilbudSak,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const månederMedSøknadsperiode: SøknadsperiodeMåned = getMånederMedSøknadsperioder(søknadsperioder);
    const alleMånederIPeriode = getMonthsInDateRange(getDateRangeFromDateRanges(søknadsperioder));
    const gårOverFlereÅr = getYearsInDateRanges(alleMånederIPeriode).length > 1;

    const visÅrstallHeading = (index: number): boolean => {
        return (
            gårOverFlereÅr &&
            (index === 0 ||
                alleMånederIPeriode[index].from.getFullYear() !== alleMånederIPeriode[index - 1].from.getFullYear())
        );
    };

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
            // description={
            //     <ExpandableInfo title="Er det én eller flere måneder som ikke vises her? ">TODO: info</ExpandableInfo>
            // }
            tag="div"
            // validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}
        >
            {alleMånederIPeriode.map((måned, index) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                const søknadsperioderIMåned = månederMedSøknadsperiode[getYearMonthKey(måned.from)];
                return søknadsperioderIMåned === undefined ? (
                    <FormBlock margin="xl" key={dayjs(måned.from).format('MM.YYYY')}>
                        <Undertittel tag={gårOverFlereÅr ? 'h3' : 'h2'} style={{ fontSize: '1rem' }}>
                            {intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
                                ukeOgÅr: dayjs(måned.from).format('MMMM YYYY'),
                            })}
                        </Undertittel>
                        <p style={{ padding: 0, margin: 0 }}>Det er ikke søkt om pleiepenger for denne måneden.</p>
                    </FormBlock>
                ) : (
                    <FormBlock margin="l" key={dayjs(måned.from).format('MM.YYYY')}>
                        {visÅrstallHeading(index) && (
                            <Box margin="xl" padBottom="l">
                                <Undertittel>{dayjs(måned.from).format('YYYY')}</Undertittel>
                            </Box>
                        )}
                        <OmsorgstilbudFormAndInfo
                            name={SoknadFormField.omsorgstilbud_enkeltdager}
                            måned={måned}
                            utilgjengeligeDager={getUtilgjengeligeDager(søknadsperioderIMåned)}
                            endringsdato={endringsdato}
                            tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                            månedTittelHeadingLevel={gårOverFlereÅr ? 3 : 2}
                            onAfterChange={onOmsorgstilbudChanged}
                            labels={{
                                addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                                    periode: mndOgÅrLabelPart,
                                }),
                                deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                                    periode: mndOgÅrLabelPart,
                                }),
                                editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                                    periode: mndOgÅrLabelPart,
                                }),
                                modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                    periode: mndOgÅrLabelPart,
                                }),
                                infoTitle: (
                                    <span className="sr-only">
                                        {intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                            periode: mndOgÅrLabelPart,
                                        })}
                                    </span>
                                ),
                            }}
                        />
                    </FormBlock>
                );
            })}
        </SoknadFormComponents.InputGroup>
    );
};

export default OmsorgstilbudMånedListe;
