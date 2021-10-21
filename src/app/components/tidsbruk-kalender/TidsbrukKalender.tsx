import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange, dateToISOString, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DagMedTid } from '../../types/SoknadFormData';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import TidsbrukKalenderDag from './TidsbrukKalenderDag';

export type TidRenderer = (tid: Partial<Time>, dato: Date) => React.ReactNode;

type KalenderDag = {
    tid?: Partial<Time>;
    tidOpprinnelig?: Partial<Time>;
};

type Kalenderdager = {
    [dato: string]: KalenderDag;
};
interface Props {
    måned: DateRange;
    dager: DagMedTid[];
    dagerOpprinnelig?: DagMedTid[];
    utilgjengeligeDager?: Date[];
    utilgjengeligDagInfo?: string;
    skjulTommeDagerIListe?: boolean;
    visEndringsinformasjon?: boolean;
    tomUkeContentRenderer?: () => React.ReactNode;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalender: React.FunctionComponent<Props> = ({
    måned,
    dager,
    dagerOpprinnelig = [],
    utilgjengeligeDager,
    utilgjengeligDagInfo,
    skjulTommeDagerIListe,
    visEndringsinformasjon,
    tomUkeContentRenderer,
}) => {
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
            disabledDates={utilgjengeligeDager}
            disabledDateInfo={utilgjengeligDagInfo}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
            allDaysInWeekDisabledContentRenderer={tomUkeContentRenderer}
            dateRendererShort={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            dateContentRenderer={(dato) => {
                const dag = kalenderdager[dateToISOString(dato)];
                return dag ? (
                    <TidsbrukKalenderDag
                        tid={dag.tid}
                        tidOpprinnelig={dag.tidOpprinnelig}
                        visEndringsinformasjon={visEndringsinformasjon}
                    />
                ) : (
                    <span />
                );
            }}
        />
    );
};

export default TidsbrukKalender;
