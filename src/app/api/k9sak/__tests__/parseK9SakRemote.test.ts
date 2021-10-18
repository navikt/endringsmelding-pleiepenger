import { ISODateRange } from '../../../types';
import { getTilsynsdagerFromK9Format } from '../getTilsynsdagerFromK9Format';
import { TilsynsordningPerioderK9 } from '../k9SakRemote';

describe('getTilsynsdagerFromK9Format', () => {
    const range1: ISODateRange = '2021-01-01/2021-01-04';
    const range2: ISODateRange = '2021-02-01/2021-02-02';
    it('henter ut korrekt data for to perioder med ulikt tilsyn', () => {
        const tilsynsperioder: TilsynsordningPerioderK9 = {};
        tilsynsperioder[range1] = { etablertTilsynTimerPerDag: 'PT0H30M' };
        tilsynsperioder[range2] = { etablertTilsynTimerPerDag: 'PT3H0M' };
        const result = getTilsynsdagerFromK9Format(tilsynsperioder);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(4);
        expect(result['2021-01-01'].hours).toEqual('0');
        expect(result['2021-01-01'].minutes).toEqual('30');
        expect(result['2021-01-04'].hours).toEqual('0');
        expect(result['2021-01-04'].minutes).toEqual('30');
        expect(result['2021-02-01'].hours).toEqual('3');
        expect(result['2021-02-01'].minutes).toEqual('0');
        expect(result['2021-02-02'].hours).toEqual('3');
        expect(result['2021-02-02'].minutes).toEqual('0');
    });
});
