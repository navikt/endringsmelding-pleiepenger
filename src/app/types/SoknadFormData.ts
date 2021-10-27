import { InputTime } from '.';
import { Arbeidsgiver } from './Arbeidsgiver';
export type TidEnkeltdag = { [isoDateString: string]: InputTime };

export interface DagMedTid {
    dato: Date;
    tid: InputTime;
}
export interface DagMedTidEllerEndretTid {
    dato: Date;
    tid?: InputTime;
    opprinneligTid?: InputTime;
}

export interface Omsorgstilbud {
    enkeltdager: TidEnkeltdag;
}

export type ArbeidstidArbeidsgiverEnkeltdag = {
    faktisk: TidEnkeltdag;
    normalt: TidEnkeltdag;
};

export type ArbeidstidArbeidsgiverMap = {
    [orgnr: string]: ArbeidstidArbeidsgiverEnkeltdag;
};

export interface ArbeidstidFormValue {
    arbeidsgiver: ArbeidstidArbeidsgiverMap;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_dager_gruppe = 'omsorgstilbud_dager_gruppe',
    omsorgstilbud_enkeltdager = 'omsorgstilbud.enkeltdager',
    arbeidstid = 'arbeidstid',
    arbeidstid_gruppe = 'arbeidstid_gruppe',
    arbeidstid_arbeidsgiver = 'arbeidstid.arbeidsgiver',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.omsorgstilbud]?: Omsorgstilbud;
    [SoknadFormField.arbeidstid]?: ArbeidstidFormValue;
}

export const getArbeidsgiverArbeidstidFormFieldName = (a: Arbeidsgiver): SoknadFormField =>
    `${SoknadFormField.arbeidstid_arbeidsgiver}.${a.organisasjonsnummer}.faktisk` as any;
