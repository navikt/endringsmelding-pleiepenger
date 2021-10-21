import { ArbeidstidEnkeltdag } from './SoknadFormData';

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    navn: string;
    arbeidstid: ArbeidstidEnkeltdag;
}
export interface AnsattArbeidstid {
    organisasjonsnummer: string;
    arbeidstid: ArbeidstidEnkeltdag;
}
