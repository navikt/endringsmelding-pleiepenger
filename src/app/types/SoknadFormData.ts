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

export type ArbeidstidAktivitetEnkeltdag = {
    faktisk: TidEnkeltdag;
    normalt: TidEnkeltdag;
};

export type ArbeidstidArbeidsgiverMap = {
    [orgnr: string]: ArbeidstidAktivitetEnkeltdag;
};

export interface ArbeidstidFormValue {
    arbeidsgiver: ArbeidstidArbeidsgiverMap;
    frilanser?: ArbeidstidAktivitetEnkeltdag;
    selvstendig?: ArbeidstidAktivitetEnkeltdag;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    hvaSkalEndres = 'hvaSkalEndres',
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_dager_gruppe = 'omsorgstilbud_dager_gruppe',
    omsorgstilbud_enkeltdager = 'omsorgstilbud.enkeltdager',
    arbeidstid = 'arbeidstid',
    arbeidstid_gruppe = 'arbeidstid_gruppe',
    arbeidstid_arbeidsgiver = 'arbeidstid.arbeidsgiver',
    arbeidstid_frilanser = 'arbeidstid.frilanser',
    arbeidstid_selvstendig = 'arbeidstid.selvstendig',
}

export enum HvaSkalEndres {
    'arbeidstid' = 'arbeidstid',
    'omsorgstilbud' = 'omsorgstilbud',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.hvaSkalEndres]: HvaSkalEndres[];
    [SoknadFormField.omsorgstilbud]?: Omsorgstilbud;
    [SoknadFormField.arbeidstid]?: ArbeidstidFormValue;
}

export const getArbeidsgiverArbeidstidFormFieldName = (a: Arbeidsgiver): SoknadFormField =>
    `${SoknadFormField.arbeidstid_arbeidsgiver}.${a.organisasjonsnummer}.faktisk` as any;

export const getFrilanserArbeidstidFormFieldName = (): SoknadFormField =>
    `${SoknadFormField.arbeidstid_frilanser}.faktisk` as any;

export const getSelvstendigArbeidstidFormFieldName = (): SoknadFormField =>
    `${SoknadFormField.arbeidstid_selvstendig}.faktisk` as any;
