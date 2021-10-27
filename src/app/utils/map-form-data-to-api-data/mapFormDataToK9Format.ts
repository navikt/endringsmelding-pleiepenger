import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { K9Sak } from '../../types/K9Sak';
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
    k9sak: K9Sak
): SoknadApiData | undefined => {
    const apiValues: SoknadApiData = {
        harBekreftetOpplysninger: values.formData.harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter: values.formData.harForståttRettigheterOgPlikter,
        id: '123',
        språk: 'nb',
        ytelse: {
            type: k9sak.ytelse.type,
            arbeidstid: values.formData.arbeidstid
                ? mapArbeidstidToK9FormatInnsending(values.formData.arbeidstid, k9sak, søknadsperioder)
                : undefined,
            tilsynsordning: values.formData.omsorgstilbud
                ? mapOmsorgstilbudToK9FormatInnsending(
                      values.formData.omsorgstilbud,
                      k9sak.ytelse.tilsynsordning.enkeltdager,
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
