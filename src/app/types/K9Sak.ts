import { ISO8601Date, ISO8601DateRange, ISO8601Duration } from '.';

export interface K9Sak {
    søknadId: string;
    søker: string;
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: ISO8601Date;
        };
        søknadsperiode: ISO8601DateRange[];
        tilsynsordning: {
            perioder: {
                [key: ISO8601DateRange]: { etablertTilsynTimerPerDag: ISO8601Duration };
            };
        };
        arbeidstid: {
            arbeidstakerList: [
                {
                    norskIdentitetsnummer?: string;
                    organisasjonsnummer: string;
                    arbeidstidInfo: {
                        perioder: {
                            [key: ISO8601DateRange]: {
                                jobberNormaltTimerPerDag: ISO8601Duration;
                                faktiskArbeidTimerPerDag: ISO8601Duration;
                            };
                        };
                    };
                }
            ];
        };
    };
}
