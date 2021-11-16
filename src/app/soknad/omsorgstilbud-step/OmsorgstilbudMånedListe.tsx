import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9SakMeta, K9TidEnkeltdag } from '../../types/K9Sak';
import { SoknadFormData, SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9SakUtils';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';

interface Props {
    tidIOmsorgstilbudSak: K9TidEnkeltdag;
    k9sakMeta: K9SakMeta;
    onOmsorgstilbudChanged?: (omsorgsdager: TidEnkeltdag) => void;
}

const OmsorgstilbudMånedListe: React.FunctionComponent<Props> = ({
    tidIOmsorgstilbudSak,
    k9sakMeta,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const { validateForm } = useFormikContext<SoknadFormData>();
    return (
        <SøknadsperioderMånedListe
            k9sakMeta={k9sakMeta}
            årstallHeaderRenderer={(årstall) => `${årstall}`}
            månedContentRenderer={(måned) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                return (
                    <OmsorgstilbudFormAndInfo
                        name={SoknadFormField.omsorgstilbud_enkeltdager}
                        periodeIMåned={måned}
                        utilgjengeligeDatoerIMåned={
                            k9sakMeta.utilgjengeligeDatoerIMånedMap[getYearMonthKey(måned.from)]
                        }
                        endringsdato={k9sakMeta.endringsdato}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        månedTittelHeadingLevel={k9sakMeta.søknadsperioderGårOverFlereÅr ? 3 : 2}
                        onAfterChange={(omsorgsdager) => {
                            validateForm();
                            onOmsorgstilbudChanged ? onOmsorgstilbudChanged(omsorgsdager) : undefined;
                        }}
                        labels={{
                            addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                periode: mndOgÅrLabelPart,
                            }),
                        }}
                    />
                );
            }}
        />
    );
};

export default OmsorgstilbudMånedListe;
