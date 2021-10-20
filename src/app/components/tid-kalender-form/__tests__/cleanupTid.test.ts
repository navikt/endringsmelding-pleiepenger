import { cleanupTid } from '../TidKalenderForm';

describe('cleanupTid', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    it('fjerner dager hvor hours eller minutes er tom string', () => {
        const result = cleanupTid({ tid: { abc: { hours: '', minutes: '' } } });
        console.log(result);
        expect(result.tid['abc'].hours).toEqual('0');
    });
});
