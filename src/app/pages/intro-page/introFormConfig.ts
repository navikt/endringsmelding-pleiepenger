import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum IntroFormField {
    'harPleiepenger' = 'harPleiepenger',
}

export interface IntroFormData {
    [IntroFormField.harPleiepenger]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.harPleiepenger]: YesOrNo.UNANSWERED,
};
