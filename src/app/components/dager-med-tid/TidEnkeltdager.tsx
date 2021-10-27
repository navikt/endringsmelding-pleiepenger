import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Element } from 'nav-frontend-typografi';
import { InputTime, ISODuration } from '../../types';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToDate, ISODurationToTime, timeHasSameDuration } from '../../utils/dateUtils';
import { datoSorter } from '../../utils/datoSorter';
import DagerMedTidListe from './dager-med-tid-liste/DagerMedTidListe';

interface Props {
    dager?: TidEnkeltdagApiData[];
    dagerOpprinnelig?: TidEnkeltdag;
    visKunEndretTid?: boolean;
    ingenEndringerMelding?: string;
}

export type DagMedEndretTid = {
    dato: Date;
    tid?: InputTime;
    tidOpprinnelig?: InputTime;
    erEndret: boolean;
};

type Kalenderdager = {
    [dato: string]: {
        tid?: ISODuration;
        tidOpprinnelig?: ISODuration;
    };
};

const TidEnkeltdager: React.FunctionComponent<Props> = ({
    dager,
    dagerOpprinnelig,
    visKunEndretTid = true,
    ingenEndringerMelding,
}) => {
    const kalenderdager: Kalenderdager = {};
    if (dager) {
        dager.forEach((isoDate) => {
            kalenderdager[isoDate.dato] = {
                ...kalenderdager[isoDate.dato],
                tid: isoDate.tid,
            };
        });
    }

    if (dagerOpprinnelig) {
        Object.keys(dagerOpprinnelig).forEach((isoDate) => {
            kalenderdager[isoDate] = {
                ...kalenderdager[isoDate],
                tidOpprinnelig: timeToIso8601Duration(dagerOpprinnelig[isoDate]),
            };
        });
    }

    const days: DagMedEndretTid[] = Object.keys(kalenderdager)
        .map((isoDate) => {
            const dag = kalenderdager[isoDate];
            const dato = ISODateToDate(isoDate);
            const tid = dag.tid ? ISODurationToTime(dag.tid) : undefined;
            const tidOpprinnelig = dag.tidOpprinnelig ? ISODurationToTime(dag.tidOpprinnelig) : undefined;
            return {
                dato,
                tid,
                tidOpprinnelig,
                erEndret: tid ? timeHasSameDuration(tid, tidOpprinnelig) === false : false,
            };
        })
        .filter((d) => (visKunEndretTid ? d.erEndret === true : true))
        .sort(datoSorter);

    const ingenDagerRegistrertMelding = ingenEndringerMelding ? (
        ingenEndringerMelding
    ) : (
        <FormattedMessage id="dagerMedTid.ingenDagerRegistrert" />
    );

    if (days.length === 0) {
        return <>{ingenDagerRegistrertMelding}</>;
    }

    const months = groupBy(days, ({ dato }) => `${dato.getFullYear()}.${dato.getMonth()}`);
    return (
        <div>
            {Object.keys(months).map((key) => {
                const dagerMedTid = months[key];
                return (
                    <Box margin="m" key={key}>
                        <EkspanderbartPanel
                            renderContentWhenClosed={false}
                            tittel={
                                <Element>
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {dayjs(dagerMedTid[0].dato).format('MMMM YYYY')}
                                    </span>
                                    {visKunEndretTid !== true && (
                                        <span>
                                            {dagerMedTid.some((d) => d.erEndret === true) ? ' (endret)' : '(uendret)'}
                                        </span>
                                    )}
                                </Element>
                            }>
                            <DagerMedTidListe dagerMedTid={dagerMedTid} viseUke={true} />
                        </EkspanderbartPanel>
                    </Box>
                );
            })}
        </div>
    );
};

export default TidEnkeltdager;
