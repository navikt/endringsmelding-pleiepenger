import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ISO8601Date, ISO8601Duration } from '.';

export enum SoknadApiDataField {
    'id' = 'id',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'omsorgstilbud' = 'omsorgstilbud',
}

export interface TidEnkeltdagApiData {
    dato: ISO8601Date;
    tid: ISO8601Duration;
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
