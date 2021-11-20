import { getEveryNthItemInArray, nthItemFilter } from '../arrayUtils';

describe('nthItemFilter', () => {
    it('hvert andre element', () => {
        expect(nthItemFilter(0, 2)).toBeTruthy();
        expect(nthItemFilter(1, 2)).toBeFalsy();
        expect(nthItemFilter(2, 2)).toBeTruthy();
        expect(nthItemFilter(3, 2)).toBeFalsy();
        expect(nthItemFilter(4, 2)).toBeTruthy();
    });
    it('hvert tredje element', () => {
        expect(nthItemFilter(0, 3)).toBeTruthy();
        expect(nthItemFilter(1, 3)).toBeFalsy();
        expect(nthItemFilter(2, 3)).toBeFalsy();
        expect(nthItemFilter(3, 3)).toBeTruthy();
        expect(nthItemFilter(4, 3)).toBeFalsy();
        expect(nthItemFilter(5, 3)).toBeFalsy();
    });
});

describe('getEveryNthItemInArray', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    it('returnerer hvert element i en liste', () => {
        const result = getEveryNthItemInArray(arr, 1);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(2);
        expect(result[2]).toEqual(3);
        expect(result[3]).toEqual(4);
        expect(result.length).toEqual(16);
    });
    it('returnerer hvert andre element i en liste', () => {
        const result = getEveryNthItemInArray(arr, 2);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(3);
        expect(result[2]).toEqual(5);
        expect(result[3]).toEqual(7);
        expect(result[4]).toEqual(9);
        expect(result[5]).toEqual(11);
        expect(result[6]).toEqual(13);
        expect(result[7]).toEqual(15);
        expect(result.length).toEqual(8);
    });
    it('returnerer hvert tredje element i en liste', () => {
        const result = getEveryNthItemInArray(arr, 3);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(4);
        expect(result[2]).toEqual(7);
        expect(result[3]).toEqual(10);
        expect(result[4]).toEqual(13);
        expect(result[5]).toEqual(16);
        expect(result.length).toEqual(6);
    });
    it('returnerer hvert fjerde element i en liste', () => {
        const result = getEveryNthItemInArray(arr, 4);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(5);
        expect(result[2]).toEqual(9);
        expect(result[3]).toEqual(13);
        expect(result.length).toEqual(4);
    });
});
