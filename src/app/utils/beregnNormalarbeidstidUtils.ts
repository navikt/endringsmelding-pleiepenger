import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue, InputTime } from '@navikt/sif-common-formik/lib';

export const beregNormalarbeidstid = (ukesnitt: string): InputTime => {
    const tid = getNumberFromNumberInputValue(ukesnitt);
    if (!tid) {
        throw new Error('beregNormalarbeidstid - invalid tid');
    }
    const { hours, minutes } = decimalTimeToTime(tid / 5);
    return {
        hours: `${hours}`,
        minutes: `${minutes}`,
    };
};
