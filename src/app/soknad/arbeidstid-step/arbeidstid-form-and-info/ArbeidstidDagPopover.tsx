import React from 'react';
import dayjs from 'dayjs';
import { Element } from 'nav-frontend-typografi';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import { InputTime } from '../../../types';
import { K9ArbeidsgiverArbeidstid } from '../../../types/K9Sak';
import { DagMedTid } from '../../../types/SoknadFormData';
import dateFormatter from '../../../utils/dateFormatterUtils';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';
import { getEndringsdato } from '../../../utils/endringsperiode';
import { datoErHistorisk } from '../../../utils/tidsbrukUtils';

interface Props {
    dato: Date;
    dager: DagMedTid[];
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
}

const getTidForDag = (dato: Date, dager: DagMedTid[]) => {
    const dag = dager.find((d) => dayjs(d.dato).isSame(dato, 'day'));
    return dag ? dag.tid : undefined;
};

const ArbeidstidDagPopoverContent: React.FunctionComponent<Props> = ({ dager, dato, arbeidstidArbeidsgiverSak }) => {
    const dateKey = dateToISODate(dato);
    const tid: InputTime | undefined = getTidForDag(dato, dager);
    const opprinneligTid: InputTime | undefined = arbeidstidArbeidsgiverSak.faktisk[dateKey];
    const jobberNormaltTid: InputTime | undefined = arbeidstidArbeidsgiverSak.normalt[dateKey];
    const erEndret = timeHasSameDuration(tid, opprinneligTid) === false;
    const erHistorisk = datoErHistorisk(dato, getEndringsdato());
    return (
        <div style={{ minWidth: '8rem', textAlign: 'left' }}>
            <Element>{dateFormatter.short(dato)}</Element>
            <ul className="clean">
                {tid && (
                    <li>
                        {erHistorisk ? 'Jobbet' : 'Skal jobbe'}: <FormattedTimeText time={tid} />
                    </li>
                )}
                {erEndret && opprinneligTid && (
                    <li>
                        Endret fra: <FormattedTimeText time={opprinneligTid} />
                    </li>
                )}
                {jobberNormaltTid && (
                    <li>
                        {erHistorisk ? 'Jobbet normalt' : 'Jobber normalt'}:{' '}
                        <FormattedTimeText time={jobberNormaltTid} />
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ArbeidstidDagPopoverContent;
