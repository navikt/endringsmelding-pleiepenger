import { isISO8601Date, isISO8601Duration, isISO8601DateRange } from '../typeguards';

describe('Test of isISO8601Date typeguard', () => {
    it('test1 - is of type ISODate string', () => {
        expect(isISO8601Date('2020-07-20')).toBe(true);
    });
    it('test1 - is NOT of type ISODate string', () => {
        expect(isISO8601Date('20200720')).toBe(false);
    });
    it('test2 - is NOT of type ISODate string', () => {
        expect(isISO8601Date('2020.07.20')).toBe(false);
    });
    it('test3 - is NOT of type ISODate string', () => {
        expect(isISO8601Date({})).toBe(false);
    });
    it('test4 - is NOT of type ISODate string', () => {
        expect(isISO8601Date(undefined)).toBe(false);
    });
    it('test5 - is NOT of type ISODate string', () => {
        expect(isISO8601Date(null)).toBe(false);
    });
    it('test6 - is NOT of type ISODate string', () => {
        expect(isISO8601Date('2020-07-20-20')).toBe(false);
    });
    it('test6 - is NOT of type ISODate string', () => {
        expect(isISO8601Date('Invalid date')).toBe(false);
    });
});

describe('Test of isISO8601Duration typeguard', () => {
    it('test1 - is of type ISO8601Duration string', () => {
        expect(isISO8601Duration('PT1H0M')).toBe(true);
    });
    it('test2 - allows only hours', () => {
        expect(isISO8601Duration('PT1H')).toBe(true);
    });
    it('test3 - allows only minutes', () => {
        expect(isISO8601Duration('PT30M')).toBe(true);
    });
    it('test3 - is NOT ISO8601Duration', () => {
        expect(isISO8601Duration(undefined)).toBe(false);
    });
    it('test3 - is NOT ISO8601Duration', () => {
        expect(isISO8601Duration('PT')).toBe(false);
    });
});

describe('Test of isISO8601DateRange typeguard', () => {
    it('test1 - is of type ISO8601Duration', () => {
        expect(isISO8601DateRange('2020-01-01/2020-02-02')).toBe(true);
    });
    it('test3 - is NOT isISO8601DateRange', () => {
        expect(isISO8601DateRange(undefined)).toBe(false);
    });
    it('test3 - is NOT isISO8601DateRange', () => {
        expect(isISO8601DateRange('2020-01-01 2020-02-02')).toBe(false);
    });
    it('test3 - is NOT isISO8601DateRange', () => {
        expect(isISO8601DateRange('2020-1-1/2020-02-02')).toBe(false);
    });
});
