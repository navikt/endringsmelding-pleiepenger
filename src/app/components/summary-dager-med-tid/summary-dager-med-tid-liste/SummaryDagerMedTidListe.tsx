import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DurationText } from '@navikt/sif-common-pleiepenger/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { groupBy } from 'lodash';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { DagMedEndretTid, sorterDag } from '../SummaryDagerMedTid';
import './summaryDagerMedTidListe.less';

dayjs.extend(isoWeek);

interface Props {
    dagerMedTid: DagMedEndretTid[];
    visMåned?: boolean;
    viseUke?: boolean;
}

const bem = bemUtils('summaryDagerMedTidListe');

const StatusTekst = ({ dag }: { dag: DagMedEndretTid }) => {
    return dag.tid ? (
        <span style={{ textDecoration: 'line-through' }}>
            (<span className="sr-only">Endret fra: </span>
            <DurationText duration={dag.tidOpprinnelig || { hours: '0', minutes: '0' }} />)
        </span>
    ) : null;
};

export const SummaryDagerMedTidListe = ({ dagerMedTid: dagerMedTid, viseUke, visMåned }: Props) => {
    const weeksWithDays = groupBy(dagerMedTid, (dag) => `${dag.dato.getFullYear()}-${dayjs(dag.dato).isoWeek()}`);
    return (
        <div className={bem.block}>
            {visMåned && <Undertittel className="m-caps">{dayjs(dagerMedTid[0].dato).format('MMM YYYY')}</Undertittel>}
            <div className={bem.element('uker')}>
                {Object.keys(weeksWithDays).map((key) => {
                    const days = weeksWithDays[key];
                    return (
                        <div key={key} className={bem.element('uke')}>
                            {viseUke && (
                                <Element tag="h4" className={bem.element('uketittel')}>
                                    <FormattedMessage
                                        id="dagerMedTid.uke"
                                        values={{ uke: dayjs(days[0].dato).isoWeek() }}
                                    />
                                </Element>
                            )}
                            <ul className={bem.element('dager')}>
                                {days.sort(sorterDag).map((dag, idx) => {
                                    const tid = dag.tid || dag.tidOpprinnelig;
                                    const timer = tid?.hours || '0';
                                    const minutter = tid?.minutes || '0';

                                    return (
                                        <li key={idx}>
                                            <div className={bem.element('dag')}>
                                                <span className={bem.element('dag__dato')}>
                                                    {dayjs(dag.dato).format('dddd DD.MM.YYYY')}:
                                                </span>
                                                <span className={bem.element('dag__tid')}>
                                                    <DurationText
                                                        duration={{ hours: timer, minutes: minutter }}
                                                        fullText={true}
                                                    />
                                                </span>
                                                <Undertekst className={bem.element('dag__status')}>
                                                    <StatusTekst dag={dag} />
                                                </Undertekst>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SummaryDagerMedTidListe;
