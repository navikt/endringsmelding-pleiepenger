import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DagMedTid } from '../../types/SoknadFormData';
import CalendarGrid from '../calendar-grid/CalendarGrid';
import TidsbrukKalenderDag from './TidsbrukKalenderDag';

export type TidRenderer = (tid: Partial<Time>, dato: Date) => React.ReactNode;
interface Props {
    måned: Date;
    dager: DagMedTid[];
    dagerOpprinnelig?: DagMedTid[];
    periode: DateRange;
    brukEtikettForInnhold?: boolean;
    visSomListe?: boolean;
    skjulTommeDagerIListe?: boolean;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalender: React.FunctionComponent<Props> = ({
    måned,
    periode,
    dager,
    // dagerOpprinnelig,
    brukEtikettForInnhold,
    visSomListe,
    skjulTommeDagerIListe,
    tidRenderer,
}) => {
    // const alleDager = { ...dager, ...dagerOpprinnelig };
    return (
        <CalendarGrid
            month={måned}
            min={periode.from}
            max={periode.to}
            renderAsList={visSomListe}
            dateFormatter={(date: Date) => (
                <AriaAlternative
                    visibleText={dayjs(date).format('D.')}
                    ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                />
            )}
            noContentRenderer={() => {
                return <span />;
            }}
            days={dager.map((dag) => ({
                date: dag.dato,
                content: (
                    <TidsbrukKalenderDag
                        tid={dag.tid}
                        dato={dag.dato}
                        tidRenderer={tidRenderer}
                        brukEtikettForInnhold={brukEtikettForInnhold}
                    />
                ),
            }))}
            hideEmptyContentInListMode={skjulTommeDagerIListe}
        />
    );
};

export default TidsbrukKalender;
