import { DateRange } from '@navikt/sif-common-formik/lib';
import { TilsynsordningK9FormatInnsending } from '../../types/k9FormatInnsending';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { Omsorgstilbud, TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToISODateRange } from '../dateUtils';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';

export const mapOmsorgstilbudToK9FormatInnsending = (
    omsorgstilbud: Omsorgstilbud,
    dagerOpprinnelig: TidEnkeltdag = {},
    søknadsperioder: DateRange[]
): TilsynsordningK9FormatInnsending | undefined => {
    const { enkeltdager } = omsorgstilbud;
    const dagerMedEndring: TidEnkeltdag = dagerOpprinnelig
        ? fjernDagerMedUendretTid(enkeltdager, dagerOpprinnelig)
        : enkeltdager;

    const dager: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        dager.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    if (dager.length === 0) {
        return undefined;
    }

    const tilsynsordning: TilsynsordningK9FormatInnsending = {
        perioder: {},
    };

    dager.forEach((dag) => {
        tilsynsordning.perioder[ISODateToISODateRange(dag.dato)] = {
            etablertTilsynTimerPerDag: dag.tid,
        };
    });
    return tilsynsordning;
};
