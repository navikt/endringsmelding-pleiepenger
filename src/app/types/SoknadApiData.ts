import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ISODate, ISODuration } from '.';

export enum SoknadApiDataField {
    'id' = 'id',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'omsorgstilbud' = 'omsorgstilbud',
    'arbeidstid' = 'arbeidstid',
}

export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface ArbeidsgiverArbeidstidApiData {
    orgnr: string;
    faktiskArbeid: TidEnkeltdagApiData[];
}

export interface OmsorgstilbudApiData {
    enkeltdager: TidEnkeltdagApiData[];
}

export interface ArbeidstidApiData {
    arbeidsgivere: ArbeidsgiverArbeidstidApiData[];
}

export interface SoknadApiData {
    [SoknadApiDataField.id]: string;
    [SoknadApiDataField.språk]: Locale;
    [SoknadApiDataField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadApiDataField.harBekreftetOpplysninger]: boolean;
    [SoknadApiDataField.omsorgstilbud]?: OmsorgstilbudApiData;
    [SoknadApiDataField.arbeidstid]?: ArbeidstidApiData;
}
