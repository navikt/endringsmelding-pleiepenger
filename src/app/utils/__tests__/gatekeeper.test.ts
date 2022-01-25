import { Arbeidsgiver, ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { ArbeidstakerMap, Sak } from '../../types/Sak';
import { erArbeidsgivereISakIAareg, kontrollerTilgangTilDialog, StoppÅrsak } from '../gatekeeper';

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
        it('slipper gjennom bruker med én sak og organisasjon-arbeidsgivere som er både i sak og aareg', () => {
            expect(kontrollerTilgangTilDialog([sak1], [orgArbeidsgiver])).toBeUndefined();
        });
    });

    describe('arbeidsgivereISakErIAareg', () => {
        const arbeidstakerMap: ArbeidstakerMap = {
            a1: { faktisk: {}, normalt: {} },
            a2: { faktisk: {}, normalt: {} },
        };
        const arbeidsgivere: Arbeidsgiver[] = [
            {
                id: 'a1',
            },
            {
                id: 'a2',
            },
        ] as any;
        it('returnerer ok når arbeidsgivere finnes', () => {
            expect(erArbeidsgivereISakIAareg(arbeidstakerMap, arbeidsgivere)).toBeTruthy();
        });
        it('returnerer feil når arbeidsgivere ikke finnes i AAreg', () => {
            expect(erArbeidsgivereISakIAareg(arbeidstakerMap, [arbeidsgivere[0]])).toBeFalsy();
        });
    });
});
