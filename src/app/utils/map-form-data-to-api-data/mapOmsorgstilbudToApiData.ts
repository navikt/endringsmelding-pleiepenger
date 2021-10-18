import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudApiData } from '../../types/SoknadApiData';
import { Omsorgstilbud } from '../../types/SoknadFormData';
import { getEnkeltdagerIPeriodeApiData } from '../tidsbrukApiUtils';

export const mapOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    endringsperiode: DateRange
): OmsorgstilbudApiData | undefined => {
    return omsorgstilbud
        ? {
              enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, endringsperiode),
          }
        : undefined;
};
