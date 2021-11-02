import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9SakMeta } from '../../types/K9Sak';
import { SoknadFormData, SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9SakUtils';
import { validateOmsorgstilbud } from '../../validation/fieldValidations';
import OmsorgstilbudFormAndInfo from './omsorgstilbud-form-and-info/OmsorgstilbudFormAndInfo';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

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
    const { values, validateForm } = useFormikContext<SoknadFormData>();
    return (
        <SøknadsperioderMånedListe
            k9sakMeta={k9sakMeta}
            fieldset={{
                inputGroupFieldName: SoknadFormField.omsorgstilbud_dager_gruppe,
                legend: <Box margin="m">Måneder med dager hvor det er søkt om pleiepenger</Box>,
                validate: () =>
                    validateOmsorgstilbud({
                        tidOpprinnelig: tidIOmsorgstilbudSak,
                        tid: values.omsorgstilbud?.enkeltdager,
                    }),
            }}
            årstallHeaderRenderer={(årstall) => `Måneder i ${årstall} du har søkt om pleiepenger og kan endre`}
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
