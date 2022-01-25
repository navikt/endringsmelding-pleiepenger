import React from 'react';
import { SøknadsperioderMånedListe } from '@navikt/sif-common-pleiepenger/lib';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import { DateDurationMap, getYearMonthKey } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { SakMetadata, TidEnkeltdag } from '../../types/Sak';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import OmsorgstilbudMånedInfo from './omsorgstilbud-måned/OmsorgstilbudMåned';

interface Props {
    tidOmsorgstilbud: DateDurationMap;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    sakMetadata: SakMetadata;
    onOmsorgstilbudChanged?: (omsorgsdager: DateDurationMap) => void;
}

const OmsorgstilbudMånedListe: React.FunctionComponent<Props> = ({
    tidOmsorgstilbud,
    tidIOmsorgstilbudSak,
    sakMetadata,
    onOmsorgstilbudChanged,
}) => {
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    return (
        <SøknadsperioderMånedListe
            periode={sakMetadata.endringsperiode}
            årstallHeaderRenderer={(årstall) => `${årstall}`}
            månedContentRenderer={(måned) => {
                const handleOnEnkeltdagChange = ({ dagerMedTid }: TidEnkeltdagEndring) => {
                    const newValues: DateDurationMap = { ...tidOmsorgstilbud };
                    Object.keys(dagerMedTid).forEach((key) => {
                        const erSøktFor = sakMetadata.dagerSøktForMap[key] === true;
                        if (erSøktFor) {
                            newValues[key] = dagerMedTid[key];
                        }
                    });
                    setFieldValue(SoknadFormField.omsorgstilbud_enkeltdager, newValues);
                    onOmsorgstilbudChanged ? onOmsorgstilbudChanged(newValues) : undefined;
                };

                return (
                    <OmsorgstilbudMånedInfo
                        periode={måned}
                        endringsperiode={sakMetadata.endringsperiode}
                        tidOmsorgstilbud={tidOmsorgstilbud}
                        tidOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        utilgjengeligeDatoer={sakMetadata.datoerIkkeSøktForIMåned[getYearMonthKey(måned.from)]}
                        månedTittelHeadingLevel={sakMetadata.søknadsperioderGårOverFlereÅr ? 3 : 2}
                        onEnkeltdagChange={handleOnEnkeltdagChange}
                    />
                );
            }}
        />
    );
};

export default OmsorgstilbudMånedListe;
