import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import { ISODateRange } from '../../types';
import {
    getISODatesInISODateRangeWeekendExcluded,
    getDateRangeFromDateRanges,
    timeHasSameDuration,
    ISODateToDate,
    getDateRangesBetweenDateRanges,
} from '../dateUtils';

describe('getISODatesInISODateRange', () => {
    it('èn ukedag', () => {
        const range: ISODateRange = '2021-02-01/2021-02-01';
        const result = getISODatesInISODateRangeWeekendExcluded(range);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        if (result) {
            expect(result[0]).toEqual('2021-02-01');
        }
    });
    it('to ukedager', () => {
        const range: ISODateRange = '2021-02-01/2021-02-02';
        const result = getISODatesInISODateRangeWeekendExcluded(range);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(2);
        if (result) {
            expect(result[0]).toEqual('2021-02-01');
            expect(result[1]).toEqual('2021-02-02');
        }
    });
    it('to ukedager over helg', () => {
        const range: ISODateRange = '2021-01-01/2021-01-04';
        const result = getISODatesInISODateRangeWeekendExcluded(range);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(2);
        if (result) {
            expect(result[0]).toEqual('2021-01-01');
            expect(result[1]).toEqual('2021-01-04');
        }
    });
});

describe('getDateRangeFromDateRanges', () => {
    it('én periode', () => {
        const result = getDateRangeFromDateRanges([
            { from: apiStringDateToDate('2021-02-01'), to: apiStringDateToDate('2021-02-02') },
        ]);
        expect(result).toBeDefined();
        if (result) {
            expect(dateToISOString(result.from)).toEqual('2021-02-01');
            expect(dateToISOString(result.to)).toEqual('2021-02-02');
        }
    });
    it('to perioder', () => {
        const result = getDateRangeFromDateRanges([
            { from: apiStringDateToDate('2021-02-01'), to: apiStringDateToDate('2021-02-02') },
            { from: apiStringDateToDate('2020-01-01'), to: apiStringDateToDate('2021-01-01') },
        ]);
        expect(result).toBeDefined();
        if (result) {
            expect(dateToISOString(result.from)).toEqual('2020-01-01');
            expect(dateToISOString(result.to)).toEqual('2021-02-02');
        }
    });
});

describe('timeHasSameDuration', () => {
    it('er lik når timer og minutter er lik', () => {
        expect(timeHasSameDuration({ hours: '1', minutes: '0' }, { hours: '1', minutes: '0' })).toBeTruthy();
    });
    it('er lik når timer er lik og minutter er udefinert', () => {
        expect(timeHasSameDuration({ hours: '1' }, { hours: '1' })).toBeTruthy();
    });
    it('er lik når timer er udefinert og minutter er lik', () => {
        expect(timeHasSameDuration({ minutes: '0' }, { minutes: '0' })).toBeTruthy();
    });
    it('er lik når timer er lik og minutter er "0" eller udefinert', () => {
        expect(timeHasSameDuration({ hours: '1', minutes: '0' }, { hours: '1', minutes: undefined })).toBeTruthy();
    });
    it('er lik når timer er "0" eller udefinert og minutter er lik', () => {
        expect(timeHasSameDuration({ hours: undefined, minutes: '2' }, { hours: '0', minutes: '2' })).toBeTruthy();
    });
    it('er ulik dersom tid 2 er udefinert', () => {
        expect(timeHasSameDuration({ hours: undefined, minutes: '2' })).toBeFalsy();
    });
    it('er ulik dersom timer er ulike', () => {
        expect(timeHasSameDuration({ hours: undefined }, { hours: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ hours: '2' }, { hours: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ hours: '2' }, { hours: undefined })).toBeFalsy();
    });
    it('er ulik dersom minutter er ulike', () => {
        expect(timeHasSameDuration({ minutes: undefined }, { minutes: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ minutes: '2' }, { minutes: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ minutes: '2' }, { minutes: undefined })).toBeFalsy();
    });
    it('er ulik dersom minutter er ulike og timer er definert', () => {
        expect(timeHasSameDuration({ hours: '1', minutes: undefined }, { hours: '1', minutes: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ hours: '1', minutes: '2' }, { hours: '1', minutes: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ hours: '1', minutes: '2' }, { hours: '1', minutes: undefined })).toBeFalsy();
    });
    it('er ulik dersom timer er ulike og minutter er like', () => {
        expect(timeHasSameDuration({ minutes: '1', hours: undefined }, { minutes: '1', hours: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ minutes: '1', hours: '2' }, { minutes: '1', hours: '1' })).toBeFalsy();
        expect(timeHasSameDuration({ minutes: '1', hours: '2' }, { minutes: '1', hours: undefined })).toBeFalsy();
    });
});

describe('getDateRangesBetweenDateRanges', () => {
    const range1: DateRange = {
        from: ISODateToDate('2021-02-01'),
        to: ISODateToDate('2021-02-02'),
    };

    const range2: DateRange = {
        from: ISODateToDate('2021-02-04'),
        to: ISODateToDate('2021-02-05'),
    };

    const range3: DateRange = {
        from: ISODateToDate('2021-02-07'),
        to: ISODateToDate('2021-02-08'),
    };

    const range4: DateRange = {
        from: ISODateToDate('2021-02-09'),
        to: ISODateToDate('2021-02-10'),
    };

    it('returnerer [] jnår det bare er en periode', () => {
        const result = getDateRangesBetweenDateRanges([range1]);
        expect(result.length).toBe(0);
    });
    it('returnerer 1 periode på 1 dag når det er 1 dag mellom to perioder', () => {
        const result = getDateRangesBetweenDateRanges([range1, range2]);
        expect(result.length).toBe(1);
        expect(dateToISOString(result[0].from)).toEqual('2021-02-03');
        expect(dateToISOString(result[0].to)).toEqual('2021-02-03');
    });
    it('returnerer 2 perioder når det er 1 dag mellom hver periode', () => {
        const result = getDateRangesBetweenDateRanges([range1, range2, range3]);
        expect(result.length).toBe(2);
        expect(dateToISOString(result[0].from)).toEqual('2021-02-03');
        expect(dateToISOString(result[0].to)).toEqual('2021-02-03');
        expect(dateToISOString(result[1].from)).toEqual('2021-02-06');
        expect(dateToISOString(result[1].to)).toEqual('2021-02-06');
    });
    it('returnerer ingen perioder når det er ingen dager mellom 2 periode', () => {
        const result = getDateRangesBetweenDateRanges([range3, range4]);
        expect(result.length).toBe(0);
    });
});
