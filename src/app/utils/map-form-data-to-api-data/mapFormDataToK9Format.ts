import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { DateRange } from '@navikt/sif-common-utils';
import { dateToISODate } from '@navikt/sif-common-utils';
import { Sak } from '../../types/Sak';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import appSentryLogger from '../appSentryLogger';
import { mapArbeidstidToK9FormatInnsending } from './mapArbeidstidToK9Format';
import { mapOmsorgstilbudToK9FormatInnsending } from './mapOmsorgstilbudToK9Format';

interface MapFormDataToApiDataValues {
    soknadId: string;
    locale: string;
    formData: SoknadFormData;
}

const logErrorToSentry = (details: string): void => {
    appSentryLogger.logError('mapFormDataToApiData failed', details);
};

export const mapFormDataToK9Format = (
    values: MapFormDataToApiDataValues,
    søknadsperioder: DateRange[],
    sak: Sak
): SoknadApiData | undefined => {
    const { arbeidssituasjon, arbeidstid, omsorgstilbud } = values.formData;
    const apiValues: SoknadApiData = {
        harBekreftetOpplysninger: values.formData.harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter: values.formData.harForståttRettigheterOgPlikter,
        id: '123',
        språk: 'nb',
        ytelse: {
            type: sak.ytelse.type,
            barn: {
                fødselsdato: sak.ytelse.barn.fødselsdato ? dateToISODate(sak.ytelse.barn.fødselsdato) : undefined,
                norskIdentitetsnummer: sak.ytelse.barn.norskIdentitetsnummer,
            },
            arbeidstid: arbeidstid
                ? mapArbeidstidToK9FormatInnsending({
                      arbeidstid,
                      arbeidssituasjon,
                      sak: sak,
                      søknadsperioder,
                  })
                : undefined,
            tilsynsordning: omsorgstilbud
                ? mapOmsorgstilbudToK9FormatInnsending(
                      omsorgstilbud,
                      sak.ytelse.tilsynsordning.enkeltdager,
                      søknadsperioder
                  )
                : undefined,
        },
    };

    if (apiValues === undefined && getEnvironmentVariable('APP_VERSION') === 'dev') {
        logErrorToSentry(JSON.stringify(values.formData));
    }

    return apiValues;
};
