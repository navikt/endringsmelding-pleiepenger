import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DagMedTid } from '../../types/SoknadFormData';
import { ISODateToDate, timeHasSameDuration } from '../../utils/dateUtils';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';
import { formatTimerOgMinutter } from '../../utils/formatTimerOgMinutter';
import { useIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

export type TidRenderer = (tid: Partial<Time>, dato: Date) => React.ReactNode;

type Kalenderdager = {
    [dato: string]: {
        tid?: Partial<Time>;
        tidOpprinnelig?: Partial<Time>;
    };
};
interface Props {
    måned: Date;
    dager: DagMedTid[];
    dagerOpprinnelig?: DagMedTid[];
    periode: DateRange;
    utilgjengeligeDager?: Date[];
    utilgjengeligDagInfo?: string;
    visSomListe?: boolean;
    skjulTommeDagerIListe?: boolean;
    visEndringsinformasjon?: boolean;
    tomUkeContentRenderer?: () => React.ReactNode;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalender: React.FunctionComponent<Props> = ({
    måned,
    periode,
    dager,
    dagerOpprinnelig = [],
    utilgjengeligDagInfo,
    visSomListe,
    utilgjengeligeDager,
    skjulTommeDagerIListe,
    visEndringsinformasjon,
    tomUkeContentRenderer,
}) => {
    const intl = useIntl();
    const kalenderdager: Kalenderdager = {};
    dager.forEach((d) => {
        const datostring = dateToISOString(d.dato);
        kalenderdager[datostring] = {
            ...kalenderdager[datostring],
            tid: d.tid,
        };
    });
    dagerOpprinnelig.forEach((d) => {
        const datostring = dateToISOString(d.dato);
        kalenderdager[datostring] = {
            ...kalenderdager[datostring],
            tidOpprinnelig: d.tid,
        };
    });

    return (
        <CalendarGrid
            month={måned}
            min={dayjs(periode.from).startOf('month').toDate()}
            max={dayjs(periode.to).endOf('month').toDate()}
            renderAsList={visSomListe}
            disabledDates={utilgjengeligeDager}
            disabledDateInfo={utilgjengeligDagInfo}
            dateFormatter={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            noContentRenderer={() => {
                return <span />;
            }}
            allDaysInWeekDisabledContentRenderer={tomUkeContentRenderer}
            days={Object.keys(kalenderdager).map((key) => {
                const dato = ISODateToDate(key);
                const dag = kalenderdager[key];
                const erEndret = timeHasSameDuration(dag.tid, dag.tidOpprinnelig) === false;
                return {
                    date: dato,
                    isDisabled: dag.tid === undefined && dag.tidOpprinnelig === undefined,
                    content: (
                        <>
                            {dag.tid && (
                                <div>
                                    {erEndret ? (
                                        <>
                                            <span
                                                title={
                                                    dag.tidOpprinnelig
                                                        ? `Endret fra ${formatTimerOgMinutter(
                                                              intl,
                                                              dag.tidOpprinnelig
                                                          )}`
                                                        : 'Lagt til'
                                                }>
                                                <FormattedTimeText time={dag.tid} />
                                            </span>
                                            {visEndringsinformasjon && (
                                                <>
                                                    {dag.tidOpprinnelig ? (
                                                        <div>
                                                            (
                                                            <Undertekst
                                                                tag="span"
                                                                aria-label="Opprinnelig tid"
                                                                style={{ textDecoration: 'line-through' }}>
                                                                <FormattedTimeText time={dag.tidOpprinnelig} />
                                                            </Undertekst>
                                                            )
                                                        </div>
                                                    ) : (
                                                        <Undertekst>(lagt til)</Undertekst>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <FormattedTimeText time={dag.tid} />
                                    )}
                                </div>
                            )}
                            {dag.tidOpprinnelig && !dag.tid && (
                                <>
                                    <FormattedTimeText time={dag.tidOpprinnelig} />
                                </>
                            )}
                        </>
                    ),
                };
            })}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
        />
    );
};

export default TidsbrukKalender;
