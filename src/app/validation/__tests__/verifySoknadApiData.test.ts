import { normalarbeidstidErUendretForArbeidsgiver } from '../verifySoknadApiData';

describe('normalarbeidstidErUendretForArbeidsgiver', () => {
    it('Returnerer true når normalarbeidstid er uendret', () => {
        const result = normalarbeidstidErUendretForArbeidsgiver(
            {
                '2021-02-01': { faktiskArbeidTimerPerDag: '', jobberNormaltTimerPerDag: 'PT1H0M' },
            },
            { '2021-02-01': { hours: '1', minutes: '0' } }
        );
        expect(result).toBeTruthy();
    });
    it('Returnerer false dersom en normalarbeidstid er endret', () => {
        const result = normalarbeidstidErUendretForArbeidsgiver(
            {
                '2021-02-01': { faktiskArbeidTimerPerDag: '', jobberNormaltTimerPerDag: 'PT1H0M' },
            },
            { '2021-02-01': { hours: '2', minutes: '0' }, '2021-02-02': { hours: '2', minutes: '0' } }
        );
        expect(result).toBeFalsy();
    });
});
