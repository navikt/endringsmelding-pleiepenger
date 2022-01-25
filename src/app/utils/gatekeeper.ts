import { Arbeidsgiver, ArbeidsgiverType } from '../types/Arbeidsgiver';
import { ArbeidstakerMap, Sak } from '../types/Sak';

export enum StoppÅrsak {
    harIngenSak = 'harIngenSak',
    harFlereSaker = 'harFlereSaker',
    harPrivatArbeidsgiver = 'harPrivatArbeidsgiver',
    arbeidsgiverSakErIkkeIAareg = 'arbeidsgiverSakErIkkeIAareg',
}

const harPrivatArbeidsgiver = (arbeidsgivere: Arbeidsgiver[]): boolean =>
    arbeidsgivere.some((a) => a.type === ArbeidsgiverType.PRIVATPERSON);

const arbeidsgiverErIAareg = (arbeidsgiverId: string, arbeidsgivere: Arbeidsgiver[]): boolean => {
    return arbeidsgivere.some((a) => a.id === arbeidsgiverId);
};

export const erArbeidsgivereISakIAareg = (arbeidstakerMap: ArbeidstakerMap, arbeidsgivereAAreg: Arbeidsgiver[]) => {
    return (
        Object.keys(arbeidstakerMap).some((id) => {
            return arbeidsgiverErIAareg(id, arbeidsgivereAAreg) === false;
        }) === false
    );
};

export const kontrollerTilgangTilDialog = (saker: Sak[], arbeidsgivere: Arbeidsgiver[]): StoppÅrsak | undefined => {
    if (saker.length === 0) {
        return StoppÅrsak.harIngenSak;
    }
    if (saker.length > 1) {
        return StoppÅrsak.harFlereSaker;
    }
    if (harPrivatArbeidsgiver(arbeidsgivere)) {
        return StoppÅrsak.harPrivatArbeidsgiver;
    }

    /** Gitt at dialog kun støtter én sak enn så lenge */
    const sak = saker[0];
    const {
        ytelse: {
            arbeidstid: { arbeidstakerMap },
        },
    } = sak;
    if (arbeidstakerMap) {
        if (erArbeidsgivereISakIAareg(arbeidstakerMap, arbeidsgivere) === false) {
            return StoppÅrsak.arbeidsgiverSakErIkkeIAareg;
        }
    }
    return undefined;
};
