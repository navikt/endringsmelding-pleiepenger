import React from 'react';
import { Time } from '@navikt/sif-common-formik/lib';
import { Undertekst } from 'nav-frontend-typografi';
import { timeHasSameDuration } from '../../utils/dateUtils';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';

interface Props {
    tid?: Partial<Time>;
    tidOpprinnelig?: Partial<Time>;
    visEndringsinformasjon?: boolean;
    erUtilgjengelig?: boolean;
}

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({ tid, tidOpprinnelig, visEndringsinformasjon }) => {
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;
    return (
        <>
            {tid && (
                <div>
                    {erEndret ? (
                        <>
                            <span>
                                <FormattedTimeText time={tid} />
                            </span>
                            {visEndringsinformasjon && (
                                <>
                                    {tidOpprinnelig ? (
                                        <div>
                                            (
                                            <Undertekst tag="span" style={{ textDecoration: 'line-through' }}>
                                                <span className="sr-only">Endret fra: </span>
                                                <FormattedTimeText time={tidOpprinnelig} />
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
                        <FormattedTimeText time={tid} />
                    )}
                </div>
            )}
            {tidOpprinnelig && !tid && (
                <>
                    <FormattedTimeText time={tidOpprinnelig} />
                </>
            )}
        </>
    );
};

export default TidsbrukKalenderDag;
