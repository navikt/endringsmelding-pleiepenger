import { K9SakRemote } from './k9SakRemote';

export const k9SakMock: K9SakRemote = {
    søknadId: '1',
    versjon: '2.0.0',
    mottattDato: '2020-10-12T12:53:21.046Z',
    søker: {
        norskIdentitetsnummer: '11111111111',
    },
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN',
        barn: {
            norskIdentitetsnummer: '22222222222',
            fødselsdato: '2018-10-30',
        },
        søknadsperiode: [
            '2018-01-12/2018-10-15',
            '2020-01-12/2021-09-15',
            '2021-10-04/2021-10-15',
            '2022-01-04/2022-01-10',
            '2022-01-27/2022-01-28',
            '2022-02-01/2023-02-05',
        ],
        tilsynsordning: {
            perioder: {
                '2021-08-12/2021-08-13': {
                    etablertTilsynTimerPerDag: 'PT2H0M',
                },
                '2021-09-01/2021-09-15': {
                    etablertTilsynTimerPerDag: 'PT7H30M',
                },
                '2021-10-01/2021-10-05': {
                    etablertTilsynTimerPerDag: 'PT4H0M',
                },
                '2021-11-01/2022-10-01': {
                    etablertTilsynTimerPerDag: 'PT7H30M',
                },
            },
        },

        arbeidstid: {
            arbeidstakerList: [
                {
                    organisasjonsnummer: '123451234',
                    arbeidstidInfo: {
                        perioder: {
                            '2021-01-01/2021-08-11': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT0H',
                            },
                            '2021-08-12/2021-08-13': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT5H30M',
                            },
                            '2021-08-13/2021-08-31': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT7H30M',
                            },
                            '2021-09-01/2021-09-15': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT0H0M',
                            },
                            '2021-09-16/2021-09-30': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT7H30M',
                            },
                            '2021-10-01/2021-10-05': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT3H30M',
                            },
                            '2021-10-06/2021-10-31': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT7H30M',
                            },
                            '2021-11-01/2022-10-01': {
                                jobberNormaltTimerPerDag: 'PT7H30M',
                                faktiskArbeidTimerPerDag: 'PT0H30M',
                            },
                        },
                    },
                },
            ],
        },
    },
};
