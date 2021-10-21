import { ISODateRange } from '../../types';
import { getArbeidstidFromK9Format } from '../getArbeidstidFromK9Format';
import { getTilsynsdagerFromK9Format } from '../getTilsynsdagerFromK9Format';
import { ArbeidstidInfoK9, TilsynsordningPerioderK9 } from '../k9SakRemote';

const range1: ISODateRange = '2021-02-01/2021-02-04';
const range2: ISODateRange = '2021-02-05/2021-02-05';
const range3: ISODateRange = '2021-02-08/2021-02-09';

describe('getTilsynsdagerFromK9Format', () => {
    it('henter ut korrekt data for to perioder med ulikt tilsyn', () => {
        const tilsynsperioder: TilsynsordningPerioderK9 = {};
        tilsynsperioder[range1] = { etablertTilsynTimerPerDag: 'PT0H30M' };
        tilsynsperioder[range3] = { etablertTilsynTimerPerDag: 'PT3H0M' };
        const result = getTilsynsdagerFromK9Format(tilsynsperioder);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(6);
        expect(result['2021-02-01'].hours).toEqual('0');
        expect(result['2021-02-01'].minutes).toEqual('30');
        expect(result['2021-02-04'].hours).toEqual('0');
        expect(result['2021-02-04'].minutes).toEqual('30');
        expect(result['2021-02-08'].hours).toEqual('3');
        expect(result['2021-02-08'].minutes).toEqual('0');
        expect(result['2021-02-09'].hours).toEqual('3');
        expect(result['2021-02-09'].minutes).toEqual('0');
    });
});

describe('getArbeidstidFromK9Format', () => {
    const arbeidstid: ArbeidstidInfoK9 = {};
    arbeidstid[range1] = { jobberNormaltTimerPerDag: 'PT3H0M', faktiskArbeidTimerPerDag: 'PT0H0M' };
    arbeidstid[range2] = { jobberNormaltTimerPerDag: 'PT2H0M', faktiskArbeidTimerPerDag: 'PT2H30M' };

    it('henter ut riktig data for tre perioder med ulik arbeidsfinformasjon', () => {
        const result = getArbeidstidFromK9Format(arbeidstid);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(5);
        expect(result['2021-02-01'].jobberNormaltTimer?.hours).toEqual('3');
        expect(result['2021-02-01'].jobberNormaltTimer?.minutes).toEqual('0');
        expect(result['2021-02-01'].faktiskArbeidTimer?.hours).toEqual('0');
        expect(result['2021-02-01'].faktiskArbeidTimer?.minutes).toEqual('0');
        expect(result['2021-02-02'].jobberNormaltTimer?.hours).toEqual('3');
        expect(result['2021-02-02'].jobberNormaltTimer?.minutes).toEqual('0');
        expect(result['2021-02-02'].faktiskArbeidTimer?.hours).toEqual('0');
        expect(result['2021-02-02'].faktiskArbeidTimer?.minutes).toEqual('0');
        expect(result['2021-02-05'].jobberNormaltTimer?.hours).toEqual('2');
        expect(result['2021-02-05'].jobberNormaltTimer?.minutes).toEqual('0');
        expect(result['2021-02-05'].faktiskArbeidTimer?.hours).toEqual('2');
        expect(result['2021-02-05'].faktiskArbeidTimer?.minutes).toEqual('30');
    });
});
