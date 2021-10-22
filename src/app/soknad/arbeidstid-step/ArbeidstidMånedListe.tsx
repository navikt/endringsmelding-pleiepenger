import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import flatten from 'lodash.flatten';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import {
    dateIsWeekDay,
    getDateRangeFromDateRanges,
    getMonthsInDateRange,
    getYearsInDateRanges,
} from '../../utils/dateUtils';
import ArbeidstidFormAndInfo from './arbeidstid-form-and-info/ArbeidstidFormAndInfo';
import { K9ArbeidsgiverArbeidstid } from '../../types/K9Sak';

interface Props {
    formFieldName: SoknadFormField;
    endringsdato: Date;
    søknadsperioder: DateRange[];
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
    onArbeidstidChanged?: (arbeidstid: TidEnkeltdag) => void;
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

const ArbeidstidMånedListe: React.FunctionComponent<Props> = ({
    formFieldName,
    endringsdato,
    søknadsperioder,
    arbeidstidArbeidsgiverSak,
    onArbeidstidChanged,
}) => {
    const intl = useIntl();
    const månederMedSøknadsperiode: SøknadsperiodeMåned = getMånederMedSøknadsperioder(søknadsperioder);
    const alleMånederIPeriode = getMonthsInDateRange(getDateRangeFromDateRanges(søknadsperioder));
    const gårOverFlereÅr = getYearsInDateRanges(alleMånederIPeriode).length > 1;
    const antallMånederMedHull = alleMånederIPeriode.length - Object.keys(månederMedSøknadsperiode).length;

    return (
        <SøknadsperioderMånedListe
            inputGroupFieldName={`${formFieldName}_gruppe`}
            endringsdato={endringsdato}
            søknadsperioder={søknadsperioder}
            legend={<span className="sr-only">Måneder med dager hvor det er søkt pleiepenger for.</span>}
            description={
                antallMånederMedHull > 0 ? (
                    <AlertStripe type="info" form="inline">
                        <Element tag="h3">{antallMånederMedHull} måneder er skjult i listen nedenfor</Element>
                        <p>La inn antallet som er skult, slik at du evt. kan bruke det i teksten Siv.</p>
                        Måneder som ikke har dager hvor det er søkt om pleiepenger for, vises ikke listen nedenfor.
                    </AlertStripe>
                ) : undefined
            }
            årstallHeaderRenderer={(årstall) => `Måneder det er søkt om pleiepenger i ${årstall}`}
            månedContentRenderer={(måned, søknadsperioderIMåned) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                return (
                    <ArbeidstidFormAndInfo
                        formFieldName={formFieldName}
                        periodeIMåned={måned}
                        utilgjengeligeDager={getUtilgjengeligeDager(søknadsperioderIMåned)}
                        endringsdato={endringsdato}
                        arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                        månedTittelHeadingLevel={gårOverFlereÅr ? 3 : 2}
                        onAfterChange={onArbeidstidChanged}
                        labels={{
                            addLabel: intlHelper(intl, 'arbeidstid.addLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            deleteLabel: intlHelper(intl, 'arbeidstid.deleteLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            editLabel: intlHelper(intl, 'arbeidstid.editLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            modalTitle: intlHelper(intl, 'arbeidstid.modalTitle', {
                                periode: mndOgÅrLabelPart,
                            }),
                            infoTitle: (
                                <span className="sr-only">
                                    {intlHelper(intl, 'arbeidstid.modalTitle', {
                                        periode: mndOgÅrLabelPart,
                                    })}
                                </span>
                            ),
                        }}
                    />
                );
            }}
        />
    );
};

export default ArbeidstidMånedListe;
