import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ISODate, ISODuration } from './';
import { K9FormatYtelseInnsending } from './k9FormatInnsending';

export enum SoknadApiDataField {
    'id' = 'id',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'omsorgstilbud' = 'omsorgstilbud',
    'arbeidstid' = 'arbeidstid',
    'ytelse' = 'ytelse',
}

export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface SoknadApiData {
    [SoknadApiDataField.id]: string;
    [SoknadApiDataField.språk]: Locale;
    [SoknadApiDataField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadApiDataField.harBekreftetOpplysninger]: boolean;
    [SoknadApiDataField.ytelse]: K9FormatYtelseInnsending;
}
