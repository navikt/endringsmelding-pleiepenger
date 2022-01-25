import { Arbeidsgiver, ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { Sak } from '../../types/Sak';
import { kontrollerTilgangTilDialog, StoppÅrsak } from '../gatekeeper';

const privatArbeidsgiver: Arbeidsgiver = {
    type: ArbeidsgiverType.PRIVATPERSON,
    id: 'p1',
    navn: 'Private',
};

const orgArbeidsgiver: Arbeidsgiver = {
    type: ArbeidsgiverType.ORGANISASJON,
    id: 'a1',
    navn: 'Private',
};

const sak1: Sak = { ytelse: { arbeidstid: { arbeidstakerMap: { [orgArbeidsgiver.id]: {} } } } } as any;
const sak2: Sak = { ytelse: { arbeidstid: { arbeidstakerMap: { ukjent: {} } } } } as any;
const sakUtenArbeid: Sak = { ytelse: { arbeidstid: { arbeidstakerMap: undefined } } } as any;
const sakFrilanser: Sak = {
    ytelse: { arbeidstid: { arbeidstakerMap: undefined, frilanser: { normalt: {}, faktisk: {} } } },
} as any;
const sakSN: Sak = {
    ytelse: { arbeidstid: { arbeidstakerMap: undefined, selvstendig: { normalt: {}, faktisk: {} } } },
} as any;

describe('gatekeeper', () => {
    describe('kontrollerTilgangTilDialog', () => {
        it('stopper bruker dersom bruker har ingen saker', () => {
            expect(kontrollerTilgangTilDialog([], [orgArbeidsgiver])).toEqual(StoppÅrsak.harIngenSak);
        });
        it('stopper bruker dersom en har flere enn én sak', () => {
            expect(kontrollerTilgangTilDialog([sak1, sak2], [orgArbeidsgiver])).toEqual(StoppÅrsak.harFlereSaker);
        });
        it('stopper bruker dersom en har privat arbeidsgiver', () => {
            expect(kontrollerTilgangTilDialog([sak1], [privatArbeidsgiver])).toEqual(StoppÅrsak.harPrivatArbeidsgiver);
        });
        it('stopper bruker dersom arbeidsgivere i sak ikke er i aareg', () => {
            expect(kontrollerTilgangTilDialog([sak2], [orgArbeidsgiver])).toEqual(
                StoppÅrsak.arbeidsgiverSakErIkkeIAareg
            );
        });
        it('stopper bruker dersom ingen arbeidstid finnes som arbeidstaker, selvstendig eller frilanser', () => {
            expect(kontrollerTilgangTilDialog([sakUtenArbeid], [orgArbeidsgiver])).toEqual(
                StoppÅrsak.arbeidsgiverSakErIkkeIAareg
            );
        });
        it('slipper gjennom bruker med én sak og organisasjon-arbeidsgivere som er både i sak og aareg', () => {
            expect(kontrollerTilgangTilDialog([sak1], [orgArbeidsgiver])).toBeUndefined();
        });
        it('slipper gjennom bruker med kun sn-arbeid', () => {
            expect(kontrollerTilgangTilDialog([sakSN], [orgArbeidsgiver])).toBeUndefined();
        });
        it('slipper gjennom bruker med kun frilanser-arbeid', () => {
            expect(kontrollerTilgangTilDialog([sakFrilanser], [orgArbeidsgiver])).toBeUndefined();
        });
    });
});
