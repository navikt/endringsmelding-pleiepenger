import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudApiData } from '../../types/SoknadApiData';
import { Omsorgstilbud, TidEnkeltdag } from '../../types/SoknadFormData';
import { getEnkeltdagerIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';

export const mapOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    dagerOpprinnelig: TidEnkeltdag = {},
    endringsperiode: DateRange
): OmsorgstilbudApiData | undefined => {
    const { enkeltdager } = omsorgstilbud;
    const dagerMedEndring: TidEnkeltdag = dagerOpprinnelig
        ? fjernDagerMedUendretTid(enkeltdager, dagerOpprinnelig)
        : enkeltdager;

    return omsorgstilbud
        ? {
              enkeltdager: getEnkeltdagerIPeriodeApiData(dagerMedEndring, endringsperiode),
          }
        : undefined;
};
