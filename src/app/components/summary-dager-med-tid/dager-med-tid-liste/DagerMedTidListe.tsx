import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DurationText } from '@navikt/sif-common-pleiepenger/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { groupBy } from 'lodash';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { datoSorter } from '../../../utils/datoSorter';
import { DagMedEndretTid } from '../SummaryDagerMedTid';
import './dagerMedTidListe.less';

dayjs.extend(isoWeek);

interface Props {
    dagerMedTid: DagMedEndretTid[];
    visMåned?: boolean;
    viseUke?: boolean;
}

const bem = bemUtils('dagerMedTidListe');

export const DagerMedTidListe = ({ dagerMedTid: dagerMedTid, viseUke, visMåned }: Props) => {
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
                                {days.sort(datoSorter).map((dag, idx) => {
                                    const tid = dag.tid || dag.tidOpprinnelig;
                                    const erEndret = dag.tid !== undefined;
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
                                                <span className={bem.element('dag__status')}>
                                                    (
                                                    {erEndret
                                                        ? dag.tidOpprinnelig === undefined
                                                            ? 'lagt til'
                                                            : 'endret'
                                                        : 'uendret'}
                                                    )
                                                </span>
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

export default DagerMedTidListe;
