import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9SakMeta } from '../../types/K9Sak';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9SakUtils';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';
// import MånederUtenDagerSøktForInfo from '../../components/måneder-uten-dager-søkt-for-info/MånederUtenDagerSøktForInfo';

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
            // legend={'Velg måned du ønsker å se omsorgstilbud '}
            legend={<span className="sr-only">Måneder med dager hvor det er søkt pleiepenger for.</span>}
            årstallHeaderRenderer={(årstall) => `Måneder i ${årstall} du har søkt om pleiepenger og kan endre`}
            // description={k9sakMeta.antallMånederUtenSøknadsperiode > 0 ? <MånederUtenDagerSøktForInfo /> : undefined}
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
