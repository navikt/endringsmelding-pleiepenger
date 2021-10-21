import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { ArbeidstidEnkeltdag, ArbeidstidNormaltOgFaktisk, TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToDate } from '../dateUtils';
import { getISODateObjectsWithinDateRange } from '../k9utils';

describe('trimK9SakTilMaksEndringsperiode', () => {
    it('fjerner arbeidstid utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-01'),
            to: ISODateToDate('2021-02-02'),
        };
        const tid: ArbeidstidNormaltOgFaktisk = {
            faktiskArbeidTimer: {
                hours: '0',
                minutes: '30',
            },
        };
        const arbeidstid: ArbeidstidEnkeltdag = {
            '2021-01-01': tid,
            '2021-02-01': tid,
            '2021-02-02': tid,
            '2021-02-03': tid,
        };
        const result = getISODateObjectsWithinDateRange(arbeidstid, endringsperiode);
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-01-01']).toBeUndefined();
        expect(result['2021-01-03']).toBeUndefined();
    });

    it('fjerner dager med tilsyn utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-01'),
            to: ISODateToDate('2021-02-02'),
        };
        const tid: Time = {
            hours: '0',
            minutes: '30',
        };
        const arbeidstid: TidEnkeltdag = {
            '2021-01-01': tid,
            '2021-02-01': tid,
            '2021-02-02': tid,
            '2021-02-03': tid,
        };
        const result = getISODateObjectsWithinDateRange(arbeidstid, endringsperiode);
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-01-01']).toBeUndefined();
        expect(result['2021-01-03']).toBeUndefined();
    });
});
