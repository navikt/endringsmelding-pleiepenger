import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { Duration } from '@navikt/sif-common-utils/lib';

export const beregNormalarbeidstidUtFraUkesnitt = (ukesnitt: string): Duration => {
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
