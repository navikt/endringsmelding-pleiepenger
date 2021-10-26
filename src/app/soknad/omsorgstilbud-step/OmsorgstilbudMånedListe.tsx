import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9SakMeta } from '../../types/K9Sak';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9utils';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';

interface Props {
    tidIOmsorgstilbudSak: TidEnkeltdag;
    k9sakMeta: K9SakMeta;
    onOmsorgstilbudChanged?: (omsorgsdager: TidEnkeltdag) => void;
}

const OmsorgstilbudMånedListe: React.FunctionComponent<Props> = ({
    tidIOmsorgstilbudSak,
    k9sakMeta,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    return (
        <SøknadsperioderMånedListe
            k9sakMeta={k9sakMeta}
            inputGroupFieldName={SoknadFormField.omsorgstilbud_dager_gruppe}
            legend={<span className="sr-only">Måneder med dager hvor det er søkt pleiepenger for.</span>}
            årstallHeaderRenderer={(årstall) => `Måneder det er søkt om pleiepenger i ${årstall}`}
            månedContentRenderer={(måned) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                return (
                    <OmsorgstilbudFormAndInfo
                        name={SoknadFormField.omsorgstilbud_enkeltdager}
                        periodeIMåned={måned}
                        utilgjengeligeDatoerIMåned={k9sakMeta.utilgjengeligeDatoerIMåned[getYearMonthKey(måned.from)]}
                        endringsdato={k9sakMeta.endringsdato}
                        tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                        månedTittelHeadingLevel={k9sakMeta.søknadsperioderGårOverFlereÅr ? 3 : 2}
                        onAfterChange={onOmsorgstilbudChanged}
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
                            infoTitle: (
                                <span className="sr-only">
                                    {intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                        periode: mndOgÅrLabelPart,
                                    })}
                                </span>
                            ),
                        }}
                    />
                );
            }}
        />
    );
};

export default OmsorgstilbudMånedListe;
