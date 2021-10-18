import { ISODate, ISODateRange, ISODuration } from '../../types';

export type TilsynsordningPerioderK9 = {
    [key: ISODateRange]: { etablertTilsynTimerPerDag: ISODuration };
};

export interface K9SakRemote {
    søknadId: string;
    søker: string;
    ytelse: {
        type: 'PLEIEPENGER_SYKT_BARN';
        barn: {
            norskIdentitetsnummer: string;
            fødselsdato: ISODate;
        };
        søknadsperiode: ISODateRange[];
        tilsynsordning: {
            perioder: TilsynsordningPerioderK9;
        };
        arbeidstid: {
            arbeidstakerList: [
                {
                    norskIdentitetsnummer?: string;
                    organisasjonsnummer: string;
                    arbeidstidInfo: {
                        perioder: {
                            [key: ISODateRange]: {
                                jobberNormaltTimerPerDag: ISODuration;
                                faktiskArbeidTimerPerDag: ISODuration;
                            };
                        };
                    };
                }
            ];
        };
    };
}
