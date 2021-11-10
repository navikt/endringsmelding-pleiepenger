import { beregNormalarbeidstid as beregnNormalarbeidstid } from '../beregnNormalarbeidstidUtils';

describe('beregNormalarbeidstid', () => {
    it('håndterer tid med punktum', () => {
        const result = beregnNormalarbeidstid('37.5');
        expect(result.hours).toEqual('7');
        expect(result.minutes).toEqual('30');
    });
    it('beregner riktig 37,5-timers uke', () => {
        const result = beregnNormalarbeidstid('37,5');
        expect(result.hours).toEqual('7');
        expect(result.minutes).toEqual('30');
    });
    it('beregner riktig 12-timers uke', () => {
        const result = beregnNormalarbeidstid('12');
        expect(result.hours).toEqual('2');
        expect(result.minutes).toEqual('24');
    });
    it('beregner riktig 12,5-timers uke', () => {
        const result = beregnNormalarbeidstid('12.5');
        expect(result.hours).toEqual('2');
        expect(result.minutes).toEqual('30');
    });
});
