import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import appSentryLogger from '../appSentryLogger';
import { mapOmsorgstilbudToApiData } from './mapOmsorgstilbudToApiData';

interface MapFormDataToApiDataValues {
    soknadId: string;
    locale: string;
    formData: SoknadFormData;
}

const logErrorToSentry = (details: string): void => {
    appSentryLogger.logError('mapFormDataToApiData failed', details);
};

export const mapFormDataToApiData = (
    values: MapFormDataToApiDataValues,
    endringsperiode: DateRange
): SoknadApiData | undefined => {
    const apiValues: SoknadApiData = {
        harBekreftetOpplysninger: values.formData.harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter: values.formData.harForståttRettigheterOgPlikter,
        id: '123',
        språk: 'nb',
        omsorgstilbud: values.formData.omsorgstilbud
            ? mapOmsorgstilbudToApiData(values.formData.omsorgstilbud, endringsperiode)
            : undefined,
    };

    if (apiValues === undefined && getEnvironmentVariable('APP_VERSION') === 'dev') {
        logErrorToSentry(JSON.stringify(values.formData));
    }
    return apiValues;
};
