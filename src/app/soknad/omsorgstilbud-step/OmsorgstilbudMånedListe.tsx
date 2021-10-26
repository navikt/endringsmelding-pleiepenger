import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
// import AlertStripe from 'nav-frontend-alertstriper';
// import { Element } from 'nav-frontend-typografi';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';
import { K9SakMeta } from '../../types/K9Sak';

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
            // description={
            //     k9sakMeta.antallMånederUtenSøknadsperiode > 0 ? (
            //         <AlertStripe type="info" form="inline">
            //             <Element tag="h3">
            //                 {k9sakMeta.antallMånederUtenSøknadsperiode} måneder er skjult i listen nedenfor
            //             </Element>
            //             <p>La inn antallet som er skult, slik at du evt. kan bruke det i teksten Siv.</p>
            //             Måneder som ikke har dager hvor det er søkt om pleiepenger for, vises ikke listen nedenfor.
            //         </AlertStripe>
            //     ) : undefined
            // }
            årstallHeaderRenderer={(årstall) => `Måneder det er søkt om pleiepenger i ${årstall}`}
            månedContentRenderer={(måned) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                return (
                    <OmsorgstilbudFormAndInfo
                        name={SoknadFormField.omsorgstilbud_enkeltdager}
                        periodeIMåned={måned}
                        utilgjengeligeDager={k9sakMeta.utilgjengeligeDatoer}
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
