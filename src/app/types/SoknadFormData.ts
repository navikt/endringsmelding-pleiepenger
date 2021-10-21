import { Time } from '@navikt/sif-common-formik/lib';

export type TidEnkeltdag = { [isoDateString: string]: Partial<Time> };

export interface ArbeidstidNormaltOgFaktisk {
    jobberNormaltTimer?: Partial<Time>;
    faktiskArbeidTimer?: Partial<Time>;
}

export type ArbeidstidEnkeltdag = { [isoDateString: string]: ArbeidstidNormaltOgFaktisk };

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

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_enkeltdager = 'omsorgstilbud.enkeltdager',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.omsorgstilbud]?: Omsorgstilbud;
}
