import React from 'react';
import { useIntl } from 'react-intl';
import { Time } from '@navikt/sif-common-formik/lib';
import { Undertekst } from 'nav-frontend-typografi';
import { timeHasSameDuration } from '../../utils/dateUtils';
import { formatTimerOgMinutter } from '../../utils/formatTimerOgMinutter';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';

interface Props {
    tid?: Partial<Time>;
    tidOpprinnelig?: Partial<Time>;
    visEndringsinformasjon?: boolean;
    erUtilgjengelig?: boolean;
}

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({ tid, tidOpprinnelig, visEndringsinformasjon }) => {
    const intl = useIntl();
    const erEndret = timeHasSameDuration(tid, tidOpprinnelig) === false;
    return (
        <>
            {tid && (
                <div>
                    {erEndret ? (
                        <>
                            <span
                                title={
                                    tidOpprinnelig
                                        ? `Endret fra ${formatTimerOgMinutter(intl, tidOpprinnelig)}`
                                        : 'Lagt til'
                                }>
                                <FormattedTimeText time={tid} />
                            </span>
                            {visEndringsinformasjon && (
                                <>
                                    {tidOpprinnelig ? (
                                        <div>
                                            (
                                            <Undertekst
                                                tag="span"
                                                aria-label="Opprinnelig tid"
                                                style={{ textDecoration: 'line-through' }}>
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
