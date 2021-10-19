import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { ISODuration } from '../../types';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToDate, ISODurationToTime } from '../../utils/dateUtils';
import DagerMedTidListe from './dager-med-tid-liste/DagerMedTidListe';
import { datoSorter } from '../../utils/datoSorter';
import { Element } from 'nav-frontend-typografi';

interface Props {
    dager?: TidEnkeltdagApiData[];
    dagerOpprinnelig?: TidEnkeltdag;
}

export type DagMedEndretTid = {
    dato: Date;
    tid?: Partial<Time>;
    tidOpprinnelig?: Partial<Time>;
};

type Kalenderdager = {
    [dato: string]: {
        tid?: ISODuration;
        tidOpprinnelig?: ISODuration;
    };
};

const TidEnkeltdager: React.FunctionComponent<Props> = ({ dager, dagerOpprinnelig }) => {
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
            };
        })
        .sort(datoSorter);

    const ingenDagerRegistrertMelding = <FormattedMessage id="dagerMedTid.ingenDagerRegistrert" />;
    if (days.length === 0) {
        return ingenDagerRegistrertMelding;
    }

    const months = groupBy(days, ({ dato }) => `${dato.getFullYear()}.${dato.getMonth()}`);
    return (
        <div>
            {Object.keys(months).map((key) => {
                const dagerMedTid = months[key];
                if (dagerMedTid.length === 0) {
                    return ingenDagerRegistrertMelding;
                }
                return (
                    <Box margin="m" key={key}>
                        <EkspanderbartPanel
                            tittel={
                                <Element>
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {dayjs(dagerMedTid[0].dato).format('MMMM YYYY')}
                                    </span>
                                    {dager && dager.length > 0 ? ' (endret)' : undefined}
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
