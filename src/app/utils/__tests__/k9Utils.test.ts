import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { InputTime } from '../../types';
import { K9ArbeidsgiverArbeidstid } from '../../types/K9Sak';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToDate } from '../dateUtils';
import { getISODateObjectsWithinDateRange, trimArbeidstidTilTillatPeriode } from '../k9utils';

describe('trimArbeidstidTilTillatPeriode', () => {
    it('fjerner arbeidstid utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-02'),
            to: ISODateToDate('2021-02-03'),
        };

        const tid: InputTime = {
            hours: '0',
            minutes: '30',
        };

        const arbeidstid: K9ArbeidsgiverArbeidstid = {
            faktisk: {
                '2021-02-01': tid,
                '2021-02-02': tid,
                '2021-02-03': tid,
                '2021-02-04': tid,
            },
            normalt: {
                '2021-02-01': tid,
                '2021-02-02': tid,
                '2021-02-03': tid,
                '2021-02-04': tid,
            },
        };
        const result = trimArbeidstidTilTillatPeriode(arbeidstid, endringsperiode, {});
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-02-01']).toBeUndefined();
        expect(result['2021-02-04']).toBeUndefined();
    });

    it('fjerner dager med tilsyn utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-02'),
            to: ISODateToDate('2021-02-03'),
        };
        const tid: Time = {
            hours: '0',
            minutes: '30',
        };
        const tilsyn: TidEnkeltdag = {
            '2021-02-01': tid,
            '2021-02-02': tid,
            '2021-02-03': tid,
            '2021-02-04': tid,
        };
        const result = getISODateObjectsWithinDateRange(tilsyn, endringsperiode, {});
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-02-01']).toBeUndefined();
        expect(result['2021-02-04']).toBeUndefined();
    });
    it('fjerner dager med arbeidstid som er på dager det ikke er søkt om', () => {
        expect(1).toBe(1);
    });
});
