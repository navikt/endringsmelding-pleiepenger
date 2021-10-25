import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9ArbeidsgiverArbeidstid, K9SakMeta } from '../../types/K9Sak';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import ArbeidstidFormAndInfo from './arbeidstid-form-and-info/ArbeidstidFormAndInfo';

interface Props {
    formFieldName: SoknadFormField;
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
    k9sakMeta: K9SakMeta;
    onArbeidstidChanged?: (arbeidstid: TidEnkeltdag) => void;
}

const ArbeidstidMånedListe: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidstidArbeidsgiverSak,
    k9sakMeta,
    onArbeidstidChanged,
}) => {
    const intl = useIntl();
    return (
        <SøknadsperioderMånedListe
            inputGroupFieldName={`${formFieldName}_gruppe`}
            k9sakMeta={k9sakMeta}
            legend={<span className="sr-only">Måneder med dager hvor det er søkt pleiepenger for.</span>}
            description={
                k9sakMeta.antallMånederUtenSøknadsperiode > 0 ? (
                    <AlertStripe type="info" form="inline">
                        <Element tag="h3">
                            {k9sakMeta.antallMånederUtenSøknadsperiode} måneder er skjult i listen nedenfor
                        </Element>
                        <p>La inn antallet som er skult, slik at du evt. kan bruke det i teksten Siv.</p>
                        Måneder som ikke har dager hvor det er søkt om pleiepenger for, vises ikke listen nedenfor.
                    </AlertStripe>
                ) : undefined
            }
            årstallHeaderRenderer={(årstall) => `Måneder det er søkt om pleiepenger i ${årstall}`}
            månedContentRenderer={(måned) => {
                const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
                return (
                    <ArbeidstidFormAndInfo
                        formFieldName={formFieldName}
                        periodeIMåned={måned}
                        utilgjengeligeDager={k9sakMeta.utilgjengeligeDatoer}
                        endringsdato={k9sakMeta.endringsdato}
                        arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                        månedTittelHeadingLevel={k9sakMeta.søknadsperioderGårOverFlereÅr ? 3 : 2}
                        onAfterChange={onArbeidstidChanged}
                        labels={{
                            addLabel: intlHelper(intl, 'arbeidstid.addLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            deleteLabel: intlHelper(intl, 'arbeidstid.deleteLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            editLabel: intlHelper(intl, 'arbeidstid.editLabel', {
                                periode: mndOgÅrLabelPart,
                            }),
                            modalTitle: intlHelper(intl, 'arbeidstid.modalTitle', {
                                periode: mndOgÅrLabelPart,
                            }),
                            infoTitle: (
                                <span className="sr-only">
                                    {intlHelper(intl, 'arbeidstid.modalTitle', {
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

export default ArbeidstidMånedListe;
