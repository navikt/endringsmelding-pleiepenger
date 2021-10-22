import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange, dateToISOString, Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DagMedTid } from '../../types/SoknadFormData';
import CalendarGrid, { CalendarGridPopoverContentRenderer } from '../calendar-grid/CalendarGrid';
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
    periodeIMåned: DateRange;
    dager: DagMedTid[];
    dagerOpprinnelig?: DagMedTid[];
    utilgjengeligeDager?: Date[];
    utilgjengeligDagInfo?: string;
    skjulTommeDagerIListe?: boolean;
    visEndringsinformasjon?: boolean;
    popoverContentRenderer?: CalendarGridPopoverContentRenderer;
    tomUkeContentRenderer?: () => React.ReactNode;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalender: React.FunctionComponent<Props> = ({
    periodeIMåned,
    dager: dagerMedTid,
    dagerOpprinnelig = [],
    utilgjengeligeDager,
    utilgjengeligDagInfo,
    skjulTommeDagerIListe,
    visEndringsinformasjon,
    popoverContentRenderer,
    tidRenderer,
    tomUkeContentRenderer,
}) => {
    const kalenderdager: Kalenderdager = {};
    dagerMedTid.forEach((d) => {
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
            month={periodeIMåned}
            disabledDates={utilgjengeligeDager}
            disabledDateInfo={utilgjengeligDagInfo}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
            allDaysInWeekDisabledContentRenderer={tomUkeContentRenderer}
            popoverContentRenderer={popoverContentRenderer}
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
                        dato={dato}
                        tid={dag.tid}
                        tidRenderer={tidRenderer}
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
