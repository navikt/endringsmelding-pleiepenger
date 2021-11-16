export interface Arbeidsgiver {
    organisasjonsnummer: string;
    navn: string;
    ansattFom?: Date;
    ansattTom?: Date;
    erUkjentIAareg?: boolean;
}
