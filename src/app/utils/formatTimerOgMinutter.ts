import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import { IntlShape } from 'react-intl';

export const formatTimerOgMinutter = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};
