import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudApiData } from '../../types/SoknadApiData';
import { Omsorgstilbud, TidEnkeltdag } from '../../types/SoknadFormData';
import { getEnkeltdagerIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';

export const mapOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    dagerOpprinnelig: TidEnkeltdag = {},
    søknadsperioder: DateRange[]
): OmsorgstilbudApiData => {
    const { enkeltdager } = omsorgstilbud;
    const dagerMedEndring: TidEnkeltdag = dagerOpprinnelig
        ? fjernDagerMedUendretTid(enkeltdager, dagerOpprinnelig)
        : enkeltdager;

    const apiData: OmsorgstilbudApiData = {
        enkeltdager: [],
    };

    søknadsperioder.forEach((periode) => {
        apiData.enkeltdager.push(...getEnkeltdagerIPeriodeApiData(dagerMedEndring, periode));
    });

    return apiData;
};
