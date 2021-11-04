import { erNormalarbeidstidEndret, erNormalarbeidstidEndretForPerioder } from '../verifySoknadApiData';

describe('erNormalarbeidstidEndretForPerioder', () => {
    it('Returnerer false når normalarbeidstid er uendret', () => {
        const result = erNormalarbeidstidEndretForPerioder(
            {
                '2021-02-01': { faktiskArbeidTimerPerDag: '', jobberNormaltTimerPerDag: 'PT1H0M' },
            },
            { '2021-02-01': { hours: '1', minutes: '0' } }
        );
        expect(result).toBeFalsy();
    });
    it('Returnerer true dersom en normalarbeidstid er endret', () => {
        const result = erNormalarbeidstidEndretForPerioder(
            {
                '2021-02-01': { faktiskArbeidTimerPerDag: '', jobberNormaltTimerPerDag: 'PT1H0M' },
            },
            { '2021-02-01': { hours: '2', minutes: '0' }, '2021-02-02': { hours: '2', minutes: '0' } }
        );
        expect(result).toBeTruthy();
    });
});

describe('erNormalarbeidstidEndret', () => {
    it('Returnerer false dersom det ikke er endret for arbeidstaker, frilanser eller selvstendig', () => {
        const result = erNormalarbeidstidEndret(
            {
                arbeidstakerList: [
                    {
                        arbeidstidInfo: {
                            perioder: {
                                '2021-02-01/2021-02-01': {
                                    faktiskArbeidTimerPerDag: 'PT1H0M',
                                    jobberNormaltTimerPerDag: 'PT1H0M',
                                },
                            },
                        },
                        organisasjonsnummer: '123',
                    },
                ],
            },
            {
                arbeidstakerMap: {
                    '123': {
                        normalt: { '2021-02-01': { hours: '1', minutes: '0' } },
                        faktisk: { '2021-02-01': { hours: '1', minutes: '0' } },
                    },
                },
            }
        );
        expect(result).toBeFalsy();
    });
});
describe('erNormalarbeidstidEndretForArbeidstaker', () => {
    it('Returnerer false dersom det ikke er endret for arbeidstaker', () => {
        const result = erNormalarbeidstidEndret(
            {
                arbeidstakerList: [
                    {
                        arbeidstidInfo: {
                            perioder: {
                                '2021-02-01/2021-02-01': {
                                    faktiskArbeidTimerPerDag: 'PT1H0M',
                                    jobberNormaltTimerPerDag: 'PT1H0M',
                                },
                            },
                        },
                        organisasjonsnummer: '123',
                    },
                ],
            },
            {
                arbeidstakerMap: {
                    '123': {
                        normalt: { '2021-02-01': { hours: '1', minutes: '0' } },
                        faktisk: { '2021-02-01': { hours: '1', minutes: '0' } },
                    },
                },
            }
        );
        expect(result).toBeFalsy();
    });
    it('Returnerer true dersom det er endret normalarbeidstid for arbeidstaker', () => {
        const result = erNormalarbeidstidEndret(
            {
                arbeidstakerList: [
                    {
                        arbeidstidInfo: {
                            perioder: {
                                '2021-02-01/2021-02-01': {
                                    faktiskArbeidTimerPerDag: 'PT1H0M',
                                    jobberNormaltTimerPerDag: 'PT1H0M',
                                },
                            },
                        },
                        organisasjonsnummer: '123',
                    },
                ],
            },
            {
                arbeidstakerMap: {
                    '123': {
                        normalt: { '2021-02-01': { hours: '2', minutes: '0' } },
                        faktisk: { '2021-02-01': { hours: '1', minutes: '0' } },
                    },
                },
            }
        );
        expect(result).toBeTruthy();
    });
});
