import { Arbeidsgiver, ArbeidsgiverType } from '../types/Arbeidsgiver';
import { Sak } from '../types/Sak';
import { erArbeidsgivereIBådeSakOgAAreg, harSakArbeidstidInfo } from './sakUtils';

export enum StoppÅrsak {
    harIngenSak = 'harIngenSak',
    harFlereSaker = 'harFlereSaker',
    harPrivatArbeidsgiver = 'harPrivatArbeidsgiver',
    arbeidsgiverSakErIkkeIAareg = 'arbeidsgiverSakErIkkeIAareg',
    arbeidIkkeRegistrert = 'arbeidIkkeRegistrert',
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
    if (arbeidstakerMap && Object.keys(arbeidstakerMap).length > 0) {
        if (erArbeidsgivereIBådeSakOgAAreg(arbeidsgivere, arbeidstakerMap) === false) {
            return StoppÅrsak.arbeidsgiverSakErIkkeIAareg;
        }
    }
    if (harSakArbeidstidInfo(arbeidsgivere, sak.ytelse.arbeidstid) === false) {
        return StoppÅrsak.arbeidsgiverSakErIkkeIAareg;
    }
    return undefined;
};
