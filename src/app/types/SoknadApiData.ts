import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ISODate, ISODuration } from '.';

export enum SoknadApiDataField {
    'id' = 'id',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'omsorgstilbud' = 'omsorgstilbud',
}

export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface OmsorgstilbudApiData {
    enkeltdager: TidEnkeltdagApiData[];
}

export interface SoknadApiData {
    [SoknadApiDataField.id]: string;
    [SoknadApiDataField.språk]: Locale;
    [SoknadApiDataField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadApiDataField.harBekreftetOpplysninger]: boolean;
    [SoknadApiDataField.omsorgstilbud]?: OmsorgstilbudApiData;
}
