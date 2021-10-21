import { ArbeidstidEnkeltdag } from './SoknadFormData';

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    navn: string;
}
export interface AnsattArbeidstid {
    organisasjonsnummer: string;
    arbeidstid: ArbeidstidEnkeltdag;
}
