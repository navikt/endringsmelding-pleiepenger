import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { InputTime } from '../types';

export const formatTimerOgMinutter = (intl: IntlShape, time: InputTime): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};
