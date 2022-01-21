import { DateRange } from '@navikt/sif-common-utils';
import { DateDurationMap, getDurationsDiff, ISODateToISODateRange } from '@navikt/sif-common-utils';
import { TilsynsordningApiData } from '../../types/YtelseApiData';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { Omsorgstilbud } from '../../types/SoknadFormData';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';

export const mapOmsorgstilbudToK9FormatInnsending = (
    omsorgstilbud: Omsorgstilbud,
    dagerOpprinnelig: DateDurationMap = {},
    søknadsperioder: DateRange[]
): TilsynsordningApiData | undefined => {
    const { enkeltdager } = omsorgstilbud;
    const dagerMedEndring: DateDurationMap = dagerOpprinnelig
        ? getDurationsDiff(enkeltdager, dagerOpprinnelig)
        : enkeltdager;

    const dager: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        dager.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    if (dager.length === 0) {
        return undefined;
    }

    const tilsynsordning: TilsynsordningApiData = {
        perioder: {},
    };

    dager.forEach((dag) => {
        tilsynsordning.perioder[ISODateToISODateRange(dag.dato)] = {
            etablertTilsynTimerPerDag: dag.tid,
        };
    });
    return tilsynsordning;
};
