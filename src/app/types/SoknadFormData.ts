import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { InputTime } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    sakBarnAktørid = 'sakBarnAktørid',
    hvaSkalEndres = 'hvaSkalEndres',
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_enkeltdager = 'omsorgstilbud.enkeltdager',
    arbeidstid = 'arbeidstid',
    arbeidstid_arbeidsgiver = 'arbeidstid.arbeidsgiver',
    arbeidstid_frilanser = 'arbeidstid.frilanser',
    arbeidstid_selvstendig = 'arbeidstid.selvstendig',
    arbeidssituasjon = 'arbeidssituasjon',
}

export enum JobberIPeriodeSvar {
    JA = 'JA',
    NEI = 'NEI',
    VET_IKKE = 'VET_IKKE',
}

export enum ArbeidsforholdField {
    arbeidsform = 'arbeidsform',
    jobberNormaltTimer = 'jobberNormaltTimer',
    jobberIPerioden = 'jobberIPerioden',
    jobberSomVanlig = 'jobberSomVanlig',
    erLiktHverUke = 'erLiktHverUke',
    fasteDager = 'fasteDager',
}

export enum HvaSkalEndres {
    'arbeidstid' = 'arbeidstid',
    'omsorgstilbud' = 'omsorgstilbud',
}

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
    enkeltdager: DateDurationMap;
}

export type ArbeidstidEnkeltdagSøknad = {
    faktisk: DateDurationMap;
    normalt: DateDurationMap;
};

export type ArbeidstidArbeidsgiverMap = {
    [orgnr: string]: ArbeidstidEnkeltdagSøknad;
};

export interface ArbeidstidFormValue {
    arbeidsgiver: ArbeidstidArbeidsgiverMap;
    frilanser?: ArbeidstidEnkeltdagSøknad;
    selvstendig?: ArbeidstidEnkeltdagSøknad;
}
export interface Arbeidssituasjon {
    [ArbeidsforholdField.jobberNormaltTimer]: string;
    [ArbeidsforholdField.jobberIPerioden]: JobberIPeriodeSvar;
    [ArbeidsforholdField.jobberSomVanlig]?: YesOrNo;
    [ArbeidsforholdField.erLiktHverUke]?: YesOrNo;
    [ArbeidsforholdField.fasteDager]?: DurationWeekdays;
}

export interface ArbeidssituasjonFormValue {
    arbeidsgiver: {
        [orgnr: string]: Arbeidssituasjon;
    };
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.sakBarnAktørid]: string;
    [SoknadFormField.hvaSkalEndres]: HvaSkalEndres[];
    [SoknadFormField.omsorgstilbud]?: Omsorgstilbud;
    [SoknadFormField.arbeidstid]: ArbeidstidFormValue;
    [SoknadFormField.arbeidssituasjon]?: ArbeidssituasjonFormValue;
}

export const getArbeidsgiverArbeidstidFormFieldName = (a: Arbeidsgiver): SoknadFormField =>
    `${SoknadFormField.arbeidstid_arbeidsgiver}.${a.id}.faktisk` as any;

export const getFrilanserArbeidstidFormFieldName = (): SoknadFormField =>
    `${SoknadFormField.arbeidstid_frilanser}.faktisk` as any;

export const getSelvstendigArbeidstidFormFieldName = (): SoknadFormField =>
    `${SoknadFormField.arbeidstid_selvstendig}.faktisk` as any;
