import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import { K9ArbeidsgiverArbeidstid, K9SakMeta } from '../../types/K9Sak';
import { SoknadFormData, SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9SakUtils';
import ArbeidstidFormAndInfo from './arbeidstid-form-and-info/ArbeidstidFormAndInfo';

interface Props {
    organisasjonsnummer: string;
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
    const { validateForm } = useFormikContext<SoknadFormData>();

    const månedContentRenderer = (måned: DateRange) => {
        const mndOgÅrLabelPart = dayjs(måned.from).format('MMMM YYYY');
        const utilgjengeligeDatoerIMåned = k9sakMeta.utilgjengeligeDatoerIMånedMap[getYearMonthKey(måned.from)];

        return (
            <ArbeidstidFormAndInfo
                formFieldName={formFieldName}
                periodeIMåned={måned}
                utilgjengeligeDatoerIMåned={utilgjengeligeDatoerIMåned}
                endringsdato={k9sakMeta.endringsdato}
                arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiverSak}
                månedTittelHeadingLevel={k9sakMeta.søknadsperioderGårOverFlereÅr ? 4 : 3}
                onAfterChange={(tid) => {
                    validateForm();
                    onArbeidstidChanged ? onArbeidstidChanged(tid) : undefined;
                }}
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
                        <span>
                            {intlHelper(intl, 'arbeidstid.modalTitle', {
                                periode: mndOgÅrLabelPart,
                            })}
                        </span>
                    ),
                }}
            />
        );
    };

    return (
        <SøknadsperioderMånedListe
            k9sakMeta={k9sakMeta}
            årstallHeadingLevel={3}
            årstallHeaderRenderer={(årstall) => `${årstall}`}
            månedContentRenderer={månedContentRenderer}
        />
    );
};

export default ArbeidstidMånedListe;
