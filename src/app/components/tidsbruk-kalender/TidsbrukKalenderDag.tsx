import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import { EtikettInfo } from 'nav-frontend-etiketter';
import FormattedTimeText from '../formatted-time-text/FormattedTimeText';
import { TidRenderer } from './TidsbrukKalender';

interface Props {
    tid: Partial<Time>;
    dato: Date;
    brukEtikettForInnhold?: boolean;
    desimalTid?: boolean;
    tidRenderer?: TidRenderer;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const TidsbrukKalenderDag: React.FunctionComponent<Props> = ({
    tid,
    dato,
    brukEtikettForInnhold,
    desimalTid,
    tidRenderer,
}) => {
    const intl = useIntl();
    const content = (
        <AriaAlternative
            visibleText={tidRenderer ? tidRenderer(tid, dato) : <FormattedTimeText time={tid} decimal={desimalTid} />}
            ariaText={formatTime(intl, tid)}
        />
    );
    return brukEtikettForInnhold ? <EtikettInfo>{content}</EtikettInfo> : content;
};

export default TidsbrukKalenderDag;
