import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { ArbeidstidEnkeltdagEndring } from '../../../components/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import { DagerSøktForMap, ISODate } from '../../../types';
import { nthItemFilter } from '../../../utils/arrayUtils';
import { dateToISODate, getISOWeekdayFromISODate } from '../../../utils/dateUtils';
import { getDagerDetErSøktForIPeriode } from '../endre-arbeidstid/EndreArbeidstid';

export const getDagerSomSkalEndresFraEnkeltdagEndring = (
    { dagMedTid, gjentagelse }: ArbeidstidEnkeltdagEndring,
    endringsperiode: DateRange,
    dagerSøktForMap: DagerSøktForMap
): ISODate[] => {
    if (gjentagelse) {
        const ukedag = dayjs(dagMedTid.dato).isoWeekday();
        const dagerIPeriodenDetErSøktFor = getDagerDetErSøktForIPeriode(
            { from: dagMedTid.dato, to: gjentagelse.tom || endringsperiode.to },
            dagerSøktForMap
        );
        const ukedager = dagerIPeriodenDetErSøktFor.filter((isoDate) => getISOWeekdayFromISODate(isoDate) === ukedag);
        const dagerSomSkalEndres = ukedager.filter((_, index) =>
            nthItemFilter(index, gjentagelse.intervalNth !== undefined ? gjentagelse.intervalNth : 1)
        );
        return dagerSomSkalEndres;
    }
    return [dateToISODate(dagMedTid.dato)];
};
