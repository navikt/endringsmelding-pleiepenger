import { isISODate, isISODuration, isISODateRange } from '../typeguards';

describe('Test of isISODate typeguard', () => {
    it('test1 - is of type ISODate string', () => {
        expect(isISODate('2020-07-20')).toBe(true);
    });
    it('test1 - is NOT of type ISODate string', () => {
        expect(isISODate('20200720')).toBe(false);
    });
    it('test2 - is NOT of type ISODate string', () => {
        expect(isISODate('2020.07.20')).toBe(false);
    });
    it('test3 - is NOT of type ISODate string', () => {
        expect(isISODate({})).toBe(false);
    });
    it('test4 - is NOT of type ISODate string', () => {
        expect(isISODate(undefined)).toBe(false);
    });
    it('test5 - is NOT of type ISODate string', () => {
        expect(isISODate(null)).toBe(false);
    });
    it('test6 - is NOT of type ISODate string', () => {
        expect(isISODate('2020-07-20-20')).toBe(false);
    });
    it('test6 - is NOT of type ISODate string', () => {
        expect(isISODate('Invalid date')).toBe(false);
    });
});

describe('Test of isISODuration typeguard', () => {
    it('test1 - is of type ISODuration string', () => {
        expect(isISODuration('PT1H0M')).toBe(true);
    });
    it('test2 - allows only hours', () => {
        expect(isISODuration('PT1H')).toBe(true);
    });
    it('test3 - allows only minutes', () => {
        expect(isISODuration('PT30M')).toBe(true);
    });
    it('test3 - is NOT ISODuration', () => {
        expect(isISODuration(undefined)).toBe(false);
    });
    it('test3 - is NOT ISODuration', () => {
        expect(isISODuration('PT')).toBe(false);
    });
});

describe('Test of isISODateRange typeguard', () => {
    it('test1 - is of type ISODuration', () => {
        expect(isISODateRange('2020-01-01/2020-02-02')).toBe(true);
    });
    it('test3 - is NOT isISODateRange', () => {
        expect(isISODateRange(undefined)).toBe(false);
    });
    it('test3 - is NOT isISODateRange', () => {
        expect(isISODateRange('2020-01-01 2020-02-02')).toBe(false);
    });
    it('test3 - is NOT isISODateRange', () => {
        expect(isISODateRange('2020-1-1/2020-02-02')).toBe(false);
    });
});
