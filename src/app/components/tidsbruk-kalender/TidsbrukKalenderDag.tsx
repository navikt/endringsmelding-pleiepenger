import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import { InputTime } from '../../types';
import { timeHasSameDuration } from '../../utils/dateUtils';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';

export type TidRenderer = (tid: InputTime, dato: Date) => React.ReactNode;
interface Props {
    dato: Date;
    tid?: InputTime;
    tidOpprinnelig?: InputTime;
    visEndringsinformasjon?: boolean;
    erUtilgjengelig?: boolean;
    tidRenderer?: TidRenderer;
}

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({
    dato,
    tid,
    tidOpprinnelig,
    visEndringsinformasjon,
    tidRenderer,
}) => {
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;

    const renderTid = (time: InputTime) => (tidRenderer ? tidRenderer(time, dato) : <FormattedTimeText time={time} />);

    return (
        <>
            {tid && (
                <div>
                    {erEndret ? (
                        <>
                            <span className="tidsbrukTidDag">{renderTid(tid)}</span>
                            {visEndringsinformasjon && (
                                <>
                                    {tidOpprinnelig ? (
                                        <div className={'tidsbruk__opprinneligTid'}>
                                            (
                                            <Undertekst tag="span" style={{ textDecoration: 'line-through' }}>
                                                <span className="sr-only">Endret fra: </span>
                                                {renderTid(tidOpprinnelig)}
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
                        <span className="tidsbrukTidDag">{renderTid(tid)}</span>
                    )}
                </div>
            )}
            {tidOpprinnelig && !tid && <>{renderTid(tidOpprinnelig)}</>}
        </>
    );
};

export default TidsbrukKalenderDag;
