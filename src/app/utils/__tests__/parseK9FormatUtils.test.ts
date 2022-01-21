import { DateRange, ISODateRange } from '@navikt/sif-common-utils';
import { K9FormatArbeidstidPeriode, K9FormatTilsynsordningPerioder } from '../../types/k9Format';
import { ISODateToDate } from '@navikt/sif-common-utils';
import { getAktivitetArbeidstidFromK9Format, getTilsynsdagerFromK9Format } from '../parseK9Format';

const range1: ISODateRange = '2021-02-01/2021-02-04';
const range2: ISODateRange = '2021-02-05/2021-02-05';
const range3: ISODateRange = '2021-02-08/2021-02-09';

describe('getTilsynsdagerFromK9Format', () => {
    it('henter ut korrekt data for to perioder med ulikt tilsyn', () => {
        const tilsynsperioder: K9FormatTilsynsordningPerioder = {};
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

describe('getArbeidsgiverArbeidstidFromK9Format', () => {
    const arbeidstid: K9FormatArbeidstidPeriode = {};
    arbeidstid[range1] = { jobberNormaltTimerPerDag: 'PT3H0M', faktiskArbeidTimerPerDag: 'PT0H0M' };
    arbeidstid[range2] = { jobberNormaltTimerPerDag: 'PT2H0M', faktiskArbeidTimerPerDag: 'PT2H30M' };

    it('henter ut riktig data for tre perioder med ulik arbeidsfinformasjon', () => {
        const søknadsperioder: DateRange[] = [
            {
                from: ISODateToDate('2021-02-01'),
                to: ISODateToDate('2021-02-05'),
            },
        ];
        const result = getAktivitetArbeidstidFromK9Format(arbeidstid, søknadsperioder);
        expect(result).toBeDefined();
        expect(Object.keys(result.faktisk).length).toBe(5);
        expect(result.normalt['2021-02-01'].hours).toEqual('3');
        expect(result.normalt['2021-02-01'].minutes).toEqual('0');
        expect(result.faktisk['2021-02-01'].hours).toEqual('0');
        expect(result.faktisk['2021-02-01'].minutes).toEqual('0');
        expect(result.normalt['2021-02-02'].hours).toEqual('3');
        expect(result.normalt['2021-02-02'].minutes).toEqual('0');
        expect(result.faktisk['2021-02-02'].hours).toEqual('0');
        expect(result.faktisk['2021-02-02'].minutes).toEqual('0');
        expect(result.normalt['2021-02-05'].hours).toEqual('2');
        expect(result.normalt['2021-02-05'].minutes).toEqual('0');
        expect(result.faktisk['2021-02-05'].hours).toEqual('2');
        expect(result.faktisk['2021-02-05'].minutes).toEqual('30');
    });
});
