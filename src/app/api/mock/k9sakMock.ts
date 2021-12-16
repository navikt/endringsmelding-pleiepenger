import { K9Format } from '../../types/k9Format';

export const k9SakMock: K9Format[] = [
    {
        barn: {
            fødselsdato: '2005-02-12',
            fornavn: 'TVILSOM',
            mellomnavn: null,
            etternavn: 'KNOTT',
            aktør_id: '2829719526754',
            identitetsnummer: '12020567099',
        },
        søknad: {
            søknadId: 'e185a3c6-803c-4f24-a1b8-8012a7a3accf',
            versjon: '1.0.0',
            mottattDato: '2021-12-14T15:43:01.265Z',
            søker: { norskIdentitetsnummer: '14026223262' },
            ytelse: {
                type: 'PLEIEPENGER_SYKT_BARN',
                barn: { norskIdentitetsnummer: '12020567099', fødselsdato: null },
                søknadsperiode: ['2021-12-01/2021-12-18'],
                // endringsperiode: [],
                // trekkKravPerioder: [],
                opptjeningAktivitet: {},
                // dataBruktTilUtledning: {
                //     harForståttRettigheterOgPlikter: true,
                //     harBekreftetOpplysninger: true,
                //     samtidigHjemme: null,
                //     harMedsøker: false,
                //     bekrefterPeriodeOver8Uker: null,
                // },
                // infoFraPunsj: null,
                // bosteder: { perioder: {}, perioderSomSkalSlettes: {} },
                // utenlandsopphold: { perioder: {}, perioderSomSkalSlettes: {} },
                // beredskap: { perioder: {}, perioderSomSkalSlettes: {} },
                // nattevåk: { perioder: {}, perioderSomSkalSlettes: {} },
                tilsynsordning: { perioder: { '2021-12-01/2021-12-18': { etablertTilsynTimerPerDag: 'PT0S' } } },
                // lovbestemtFerie: { perioder: {} },
                arbeidstid: {
                    arbeidstakerList: [
                        {
                            norskIdentitetsnummer: null,
                            organisasjonsnummer: '805824352',
                            arbeidstidInfo: {
                                perioder: {
                                    '2021-12-01/2021-12-13': {
                                        jobberNormaltTimerPerDag: 'PT6H36M',
                                        faktiskArbeidTimerPerDag: 'PT0S',
                                    },
                                    '2021-12-14/2021-12-18': {
                                        jobberNormaltTimerPerDag: 'PT6H36M',
                                        faktiskArbeidTimerPerDag: 'PT0S',
                                    },
                                },
                            },
                        },
                        {
                            norskIdentitetsnummer: null,
                            organisasjonsnummer: '839942907',
                            arbeidstidInfo: {
                                perioder: {
                                    '2021-12-01/2021-12-18': {
                                        jobberNormaltTimerPerDag: 'PT0S',
                                        faktiskArbeidTimerPerDag: 'PT0S',
                                    },
                                },
                            },
                        },
                    ],
                    frilanserArbeidstidInfo: null,
                    selvstendigNæringsdrivendeArbeidstidInfo: null,
                },
                // uttak: { perioder: { '2021-12-01/2021-12-18': { timerPleieAvBarnetPerDag: 'PT7H30M' } } },
                // omsorg: { relasjonTilBarnet: null, beskrivelseAvOmsorgsrollen: null },
            },
            // språk: 'nb',
            // journalposter: [],
            // begrunnelseForInnsending: { tekst: null },
        },
    },
    {
        barn: {
            fødselsdato: '2005-10-30',
            fornavn: 'TYKKMAGET',
            mellomnavn: null,
            etternavn: 'VEGGPRYD',
            aktør_id: '2922001168945',
            identitetsnummer: '30100577255',
        },
        søknad: {
            søknadId: 'generert',
            versjon: '1.0.0.',
            mottattDato: '2021-12-15T12:55:10.405Z',
            søker: { norskIdentitetsnummer: '00000000000' },
            ytelse: {
                type: 'PLEIEPENGER_SYKT_BARN',
                barn: { norskIdentitetsnummer: '00000000000', fødselsdato: null },
                søknadsperiode: ['2021-12-01/2021-12-16'],
                // endringsperiode: [],
                // trekkKravPerioder: [],
                opptjeningAktivitet: {},
                // dataBruktTilUtledning: null,
                // infoFraPunsj: null,
                // bosteder: { perioder: {}, perioderSomSkalSlettes: {} },
                // utenlandsopphold: { perioder: {}, perioderSomSkalSlettes: {} },
                // beredskap: { perioder: {}, perioderSomSkalSlettes: {} },
                // nattevåk: { perioder: {}, perioderSomSkalSlettes: {} },
                tilsynsordning: { perioder: { '2021-12-01/2021-12-16': { etablertTilsynTimerPerDag: 'PT0S' } } },
                // lovbestemtFerie: { perioder: {} },
                arbeidstid: {
                    arbeidstakerList: [
                        {
                            norskIdentitetsnummer: null,
                            organisasjonsnummer: '805824352',
                            arbeidstidInfo: {
                                perioder: {
                                    '2021-12-01/2021-12-16': {
                                        jobberNormaltTimerPerDag: 'PT8H',
                                        faktiskArbeidTimerPerDag: 'PT0S',
                                    },
                                },
                            },
                        },
                        {
                            norskIdentitetsnummer: null,
                            organisasjonsnummer: '839942907',
                            arbeidstidInfo: {
                                perioder: {
                                    '2021-12-01/2021-12-16': {
                                        jobberNormaltTimerPerDag: 'PT0S',
                                        faktiskArbeidTimerPerDag: 'PT0S',
                                    },
                                },
                            },
                        },
                    ],
                    frilanserArbeidstidInfo: null,
                    selvstendigNæringsdrivendeArbeidstidInfo: null,
                },
                // uttak: { perioder: {} },
                // omsorg: { relasjonTilBarnet: null, beskrivelseAvOmsorgsrollen: null },
            },
            // språk: 'nb',
            // journalposter: [],
            // begrunnelseForInnsending: { tekst: null },
        },
    },
];
