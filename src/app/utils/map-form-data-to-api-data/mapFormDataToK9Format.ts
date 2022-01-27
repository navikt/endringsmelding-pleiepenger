import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { DateRange } from '@navikt/sif-common-utils';
import { dateToISODate } from '@navikt/sif-common-utils';
import { skalEndreArbeidstid, skalEndreOmsorgstilbud } from '../../soknad/soknadStepsConfig';
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
    const { arbeidstid, omsorgstilbud, hvaSkalEndres } = values.formData;
    const apiValues: SoknadApiData = {
        harBekreftetOpplysninger: values.formData.harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter: values.formData.harForståttRettigheterOgPlikter,
        id: sak.søknadId,
        språk: sak.språk,
        ytelse: {
            type: sak.ytelse.type,
            barn: {
                fødselsdato: sak.ytelse.barn.fødselsdato ? dateToISODate(sak.ytelse.barn.fødselsdato) : undefined,
                norskIdentitetsnummer: sak.ytelse.barn.norskIdentitetsnummer,
            },
            arbeidstid:
                arbeidstid && skalEndreArbeidstid({ hvaSkalEndres })
                    ? mapArbeidstidToK9FormatInnsending({
                          arbeidstid,
                          sak: sak,
                          søknadsperioder,
                      })
                    : undefined,
            tilsynsordning:
                omsorgstilbud && skalEndreOmsorgstilbud({ hvaSkalEndres })
                    ? mapOmsorgstilbudToK9FormatInnsending(
                          omsorgstilbud,
                          sak.ytelse.tilsynsordning.enkeltdager,
                          søknadsperioder
                      )
                    : undefined,
            // søknadsperiode: sak.ytelse.søknadsperioder.map((periode) => dateRangeToISODateRange(periode)),
        },
    };

    if (apiValues === undefined && getEnvironmentVariable('APP_VERSION') === 'dev') {
        logErrorToSentry(JSON.stringify(values.formData));
    }

    return apiValues;
};
