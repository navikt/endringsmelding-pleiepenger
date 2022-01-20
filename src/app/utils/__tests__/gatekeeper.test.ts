import { Arbeidsgiver, ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { Sak } from '../../types/Sak';
import { kontrollerTilgangTilDialog, StoppÅrsak } from '../gatekeeper';

const privatArbeidsgiver: Arbeidsgiver = {
    type: ArbeidsgiverType.PRIVATPERSON,
    id: '123',
    navn: 'Private',
};

const orgArbeidsgiver: Arbeidsgiver = {
    type: ArbeidsgiverType.ORGANISASJON,
    id: '123',
    navn: 'Private',
};

const sak1: Sak = {} as any;
const sak2: Sak = {} as any;

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
        it('slipper gjennom bruker med én sak og organisasjon-arbeidsgivere', () => {
            expect(kontrollerTilgangTilDialog([sak1], [orgArbeidsgiver])).toBeUndefined();
        });
    });
});
