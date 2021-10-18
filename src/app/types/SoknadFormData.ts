import { Time } from '@navikt/sif-common-formik/lib';

export type TidEnkeltdag = { [isoDateString: string]: Partial<Time> };

export interface DagMedTid {
    dato: Date;
    tid: Partial<Time>;
}

export interface Omsorgstilbud {
    enkeltdager: TidEnkeltdag;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    omsorgstilbud = 'omsorgstilbud',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.omsorgstilbud]?: Omsorgstilbud;
}
