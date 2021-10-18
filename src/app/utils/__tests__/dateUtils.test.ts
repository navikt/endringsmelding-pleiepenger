import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { ISODateRange } from '../../types';
import { getISODatesInISODateRange, getMinMaxInDateRanges } from '../dateUtils';

describe('getISODatesInISODateRange', () => {
    it('èn ukedag', () => {
        const range: ISODateRange = '2021-02-01/2021-02-01';
        const result = getISODatesInISODateRange(range);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        if (result) {
            expect(result[0]).toEqual('2021-02-01');
        }
    });
    it('to ukedager', () => {
        const range: ISODateRange = '2021-02-01/2021-02-02';
        const result = getISODatesInISODateRange(range);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(2);
        if (result) {
            expect(result[0]).toEqual('2021-02-01');
            expect(result[1]).toEqual('2021-02-02');
        }
    });
    it('to ukedager over helg', () => {
        const range: ISODateRange = '2021-01-01/2021-01-04';
        const result = getISODatesInISODateRange(range);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(2);
        if (result) {
            expect(result[0]).toEqual('2021-01-01');
            expect(result[1]).toEqual('2021-01-04');
        }
    });
});

describe('getMinMaxInDateRanges', () => {
    it('én periode', () => {
        const result = getMinMaxInDateRanges([
            { from: apiStringDateToDate('2021-02-01'), to: apiStringDateToDate('2021-02-02') },
        ]);
        expect(result).toBeDefined();
        if (result) {
            expect(dateToISOString(result.from)).toEqual('2021-02-01');
            expect(dateToISOString(result.to)).toEqual('2021-02-02');
        }
    });
    it('to perioder', () => {
        const result = getMinMaxInDateRanges([
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
