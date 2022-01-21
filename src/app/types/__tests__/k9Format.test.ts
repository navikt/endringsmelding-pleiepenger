import { ISODuration } from '@navikt/sif-common-utils/lib';
import {
    itemsAreValidISODateRanges,
    K9FormatArbeidstid,
    K9FormatArbeidstidPeriode,
    K9FormatArbeidstidTid,
    K9FormatBarn,
    K9FormatTilsynsordningPerioder,
    k9FormatTypeChecker,
} from '../k9Format';

const {
    isK9FormatBarn,
    isK9FormatArbeidstidTid,
    isK9FormatArbeidstidPerioder,
    isK9FormatArbeidstid,
    isK9FormatTilsynsordningPerioder,
} = k9FormatTypeChecker;

const duration: ISODuration = 'PT7H30M';

const arbeidstidPeriodeEnkeltdag = {
    jobberNormaltTimerPerDag: duration,
    faktiskArbeidTimerPerDag: duration,
};
const arbeidstidPerioder: K9FormatArbeidstidPeriode = {
    '2020-01-01/2020-01-02': arbeidstidPeriodeEnkeltdag,
};

const ugyldigArbeidstidPerioder = { ...arbeidstidPerioder, ugyldigDateRange: arbeidstidPeriodeEnkeltdag };

describe('k9FormatTypeChecker', () => {
    describe('itemsAreValidISODateRanges', () => {
        it('er ok for gyldige tidsperioder', () => {
            expect(itemsAreValidISODateRanges(['2020-01-01/2020-02-01'])).toBeTruthy();
        });
        it('returnerer false for ugyldige tidsperioder', () => {
            expect(itemsAreValidISODateRanges(['2020-01-012020-02-01'])).toBeFalsy();
        });
    });
    describe('isK9FormatArbeidstidTid', () => {
        const tid: K9FormatArbeidstidTid = {
            jobberNormaltTimerPerDag: duration,
            faktiskArbeidTimerPerDag: duration,
        };
        it('er ok ved gyldig tid', () => {
            expect(isK9FormatArbeidstidTid(tid)).toBeTruthy();
        });
        it('feiler ved ugyldig tid', () => {
            expect(isK9FormatArbeidstidTid({ ...tid, jobberNormaltTimerPerDag: null })).toBeFalsy();
            expect(isK9FormatArbeidstidTid({ ...tid, faktiskArbeidTimerPerDag: null })).toBeFalsy();
            expect(isK9FormatArbeidstidTid({ ...tid, faktiskArbeidTimerPerDag: 'PT' })).toBeFalsy();
            expect(isK9FormatArbeidstidTid({ ...tid, jobberNormaltTimerPerDag: 'PT' })).toBeFalsy();
        });
    });
    describe('isK9FormatArbeidstidPeriode', () => {
        it('er ok ved gyldig tid', () => {
            expect(isK9FormatArbeidstidPerioder(arbeidstidPerioder)).toBeTruthy();
        });
        it('feiler ved ugyldig daterange key', () => {
            expect(isK9FormatArbeidstidPerioder(ugyldigArbeidstidPerioder)).toBeFalsy();
        });
        it('feiler ved ugyldig tid for en periode', () => {
            expect(
                isK9FormatArbeidstidPerioder({
                    '2020-01-01': { jobberNormaltTimerPerDag: duration, faktiskArbeidTimerPerDag: null },
                })
            ).toBeFalsy();
            expect(
                isK9FormatArbeidstidPerioder({
                    '2020-01-01': { jobberNormaltTimerPerDag: null, faktiskArbeidTimerPerDag: duration },
                })
            ).toBeFalsy();
        });
    });
    describe('isK9FormatArbeidstid', () => {
        const gyldigTomArbeidstid: K9FormatArbeidstid = {
            arbeidstakerList: [],
            frilanserArbeidstidInfo: null,
            selvstendigNæringsdrivendeArbeidstidInfo: null,
        };
        const gyldigArbeidstidMedArbeidstaker: K9FormatArbeidstid = {
            ...gyldigTomArbeidstid,
            arbeidstakerList: [
                {
                    arbeidstidInfo: { perioder: arbeidstidPerioder },
                    norskIdentitetsnummer: '234',
                    organisasjonsnummer: '234',
                },
            ],
        };
        const gyldigArbeidstidFrilanser: K9FormatArbeidstid = {
            ...gyldigTomArbeidstid,
            frilanserArbeidstidInfo: { perioder: arbeidstidPerioder },
        };
        const gyldigArbeidstidSN: K9FormatArbeidstid = {
            ...gyldigTomArbeidstid,
            selvstendigNæringsdrivendeArbeidstidInfo: { perioder: arbeidstidPerioder },
        };
        it('er ok ved ingen arbeidstid', () => {
            expect(isK9FormatArbeidstid(gyldigTomArbeidstid)).toBeTruthy();
        });
        it('er ok ved arbeidstaker arbeidstid', () => {
            expect(isK9FormatArbeidstid(gyldigArbeidstidMedArbeidstaker)).toBeTruthy();
        });
        it('er ok ved frilanser arbeidstid', () => {
            expect(isK9FormatArbeidstid(gyldigArbeidstidFrilanser)).toBeTruthy();
        });
        it('er ok ved sn arbeidstid', () => {
            expect(isK9FormatArbeidstid(gyldigArbeidstidSN)).toBeTruthy();
        });
        it('feiler ved ugyldig arbeidstaker arbeidstid', () => {
            expect(isK9FormatArbeidstid({ arbeidstakerList: [{ arbeidstidInfo: { perioder: null } }] })).toBeFalsy();
            expect(isK9FormatArbeidstid({ arbeidstakerList: [{ arbeidstidInfo: undefined }] })).toBeFalsy();
        });
        it('feiler ved ugyldig frilanser arbeidstid', () => {
            const data = {
                ...gyldigArbeidstidFrilanser,
                frilanserArbeidstidInfo: { perioder: ugyldigArbeidstidPerioder },
            };
            expect(isK9FormatArbeidstid(data)).toBeFalsy();
        });
        it('feiler ved ugyldig sn arbeidstid', () => {
            const data = {
                ...gyldigArbeidstidSN,
                selvstendigNæringsdrivendeArbeidstidInfo: { perioder: ugyldigArbeidstidPerioder },
            };
            expect(isK9FormatArbeidstid(data)).toBeFalsy();
        });
    });
    describe('isK9FormatBarn', () => {
        const barn: K9FormatBarn = {
            aktørId: '234',
            etternavn: 'etternavn',
            fornavn: 'fornavn',
            fødselsdato: '2020-01-01',
            identitetsnummer: '123',
            mellomnavn: null,
        };
        it('feiler ved ugyldig barn', () => {
            expect(isK9FormatBarn({ ...barn, fornavn: null })).toBeFalsy();
            expect(isK9FormatBarn({ ...barn, etternavn: null })).toBeFalsy();
            expect(isK9FormatBarn({ ...barn, fødselsdato: null })).toBeFalsy();
            expect(isK9FormatBarn({ ...barn, fødselsdato: '20-20-20' })).toBeFalsy();
            expect(isK9FormatBarn({ ...barn, identitetsnummer: null })).toBeFalsy();
            expect(isK9FormatBarn({ ...barn, aktørId: null })).toBeFalsy();
        });
        it('er ok ved gyldig barn', () => {
            expect(isK9FormatBarn(barn)).toBeTruthy();
        });
    });
    describe('isK9FormatTilsynsordningPerioder', () => {
        const tilsynsperioder: K9FormatTilsynsordningPerioder = {
            '2020-01-01/2020-02-02': {
                etablertTilsynTimerPerDag: 'PT5H',
            },
        };
        it('er ok ved gyldige perioder', () => {
            expect(isK9FormatTilsynsordningPerioder(tilsynsperioder)).toBeTruthy();
        });
        it('feiler ved ugyldig tidsperiode', () => {
            expect(
                isK9FormatTilsynsordningPerioder({
                    '2020-01-01/202002-02': {
                        etablertTilsynTimerPerDag: 'PT5H',
                    },
                })
            ).toBeFalsy();
        });
        it('feiler ved ugyldig tid per dag', () => {
            expect(
                isK9FormatTilsynsordningPerioder({
                    '2020-01-01/2020-02-02': {
                        etablertTilsynTimerPerDag: null,
                    },
                })
            ).toBeFalsy();
            expect(
                isK9FormatTilsynsordningPerioder({
                    '2020-01-01/2020-02-02': null,
                })
            ).toBeFalsy();
        });
    });
});
