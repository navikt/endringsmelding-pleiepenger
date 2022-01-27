import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { YtelseApiData } from './YtelseApiData';

export enum SoknadApiDataField {
    'id' = 'id',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'omsorgstilbud' = 'omsorgstilbud',
    'arbeidstid' = 'arbeidstid',
    'ytelse' = 'ytelse',
    'barn' = 'barn',
}

export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface SoknadApiData {
    [SoknadApiDataField.id]: string;
    [SoknadApiDataField.språk]: string;
    [SoknadApiDataField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadApiDataField.harBekreftetOpplysninger]: boolean;
    [SoknadApiDataField.ytelse]: YtelseApiData;
}
