import { DateRange } from '@navikt/sif-common-formik/lib';
import { getDatesInMonthOutsideDateRange } from '@navikt/sif-common-utils/lib';
import { getYearMonthKey } from './sakUtils';

export const getUtilgjengeligeDatoerIMåned = (
    utilgjengeligeDatoer: Date[],
    måned: Date,
    endringsperiode: DateRange
): Date[] => {
    const yearMonthKey = getYearMonthKey(måned);
    return [
        ...getDatesInMonthOutsideDateRange(måned, endringsperiode),
        ...utilgjengeligeDatoer.filter((d) => getYearMonthKey(d) === yearMonthKey),
    ];
};
