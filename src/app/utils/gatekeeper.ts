import { Arbeidsgiver, ArbeidsgiverType } from '../types/Arbeidsgiver';
import { Sak } from '../types/Sak';

export enum StoppÅrsak {
    harIngenSak = 'harIngenSak',
    harFlereSaker = 'harFlereSaker',
    harPrivatArbeidsgiver = 'harPrivatArbeidsgiver',
}

const harPrivatArbeidsgiver = (arbeidsgivere: Arbeidsgiver[]): boolean =>
    arbeidsgivere.some((a) => a.type === ArbeidsgiverType.PRIVATPERSON);

export const kontrollerTilgangTilDialog = (saker: Sak[], arbeidsgivere: Arbeidsgiver[]): StoppÅrsak | undefined => {
    if (saker.length === 0) {
        return StoppÅrsak.harIngenSak;
    }
    if (saker.length > 1) {
        return StoppÅrsak.harFlereSaker;
    }
    if (saker.length > 1) {
        return StoppÅrsak.harFlereSaker;
    }
    if (harPrivatArbeidsgiver(arbeidsgivere)) {
        return StoppÅrsak.harPrivatArbeidsgiver;
    }
    return undefined;
};
