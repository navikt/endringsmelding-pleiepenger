import { Time } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

export type TidEnkeltdag = { [isoDateString: string]: Partial<Time> };
export interface DagMedTid {
    dato: Date;
    tid: Partial<Time>;
}
export interface DagMedTidEllerEndretTid {
    dato: Date;
    tid?: Partial<Time>;
    opprinneligTid?: Partial<Time>;
}

export interface Omsorgstilbud {
    enkeltdager: TidEnkeltdag;
}

export type ArbeidstidArbeidsgiver = {
    [orgnr: string]: {
        faktisk: TidEnkeltdag;
        normalt: TidEnkeltdag;
    };
};

export interface Arbeidstid {
    arbeidsgiver: ArbeidstidArbeidsgiver;
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
    [SoknadFormField.arbeidstid]?: Arbeidstid;
}

export const getArbeidsgiverArbeidstidFormFieldName = (a: Arbeidsgiver): SoknadFormField =>
    `${SoknadFormField.arbeidstid_arbeidsgiver}.${a.organisasjonsnummer}.faktisk` as any;
