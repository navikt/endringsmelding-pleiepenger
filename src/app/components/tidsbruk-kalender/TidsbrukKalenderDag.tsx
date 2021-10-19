import React from 'react';
import { useIntl } from 'react-intl';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import { formatTimerOgMinutter } from '../../utils/formatTimerOgMinutter';
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
            ariaText={formatTimerOgMinutter(intl, tid)}
        />
    );
    return brukEtikettForInnhold ? <EtikettInfo>{content}</EtikettInfo> : content;
};

export default TidsbrukKalenderDag;
