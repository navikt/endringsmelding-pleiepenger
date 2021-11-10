import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import {
    ArbeidsforholdField,
    Arbeidssituasjon,
    JobberIPeriodeSvar,
    SoknadFormField,
} from '../../../types/SoknadFormData';
import { getTimerTekst } from '../../../utils/arbeidssituasjonUtils';
import SoknadFormComponents from '../../SoknadFormComponents';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

interface Props {
    arbeidsgiver: Arbeidsgiver;
    arbeidssituasjon: Arbeidssituasjon;
    parentFieldName: string;
}

export type ArbeidIPeriodeIntlValues = {
    hvor: string;
    skalEllerHarJobbet: string;
    timer: string;
};
const ArbeidIPeriodenSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsgiver,
    arbeidssituasjon,
    parentFieldName,
}) => {
    const intl = useIntl();

    const intlValues: ArbeidIPeriodeIntlValues = {
        skalEllerHarJobbet: intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.planlagt'),
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsgiver.navn }),
        timer: getTimerTekst(intl, arbeidssituasjon.jobberNormaltTimer),
    };
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as SoknadFormField;

    const getSpørsmål = (spørsmål: ArbeidsforholdField) =>
        intlHelper(intl, `arbeidIPeriode.${spørsmål}.spm`, intlValues as any);

    return (
        <>
            <SoknadFormComponents.RadioPanelGroup
                name={getFieldName(ArbeidsforholdField.jobberIPerioden)}
                legend={getSpørsmål(ArbeidsforholdField.jobberIPerioden)}
                // validate={getArbeidJobberValidator(intlValues)}
                radios={[
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.JA}`),
                        value: JobberIPeriodeSvar.JA,
                    },
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.NEI}`),
                        value: JobberIPeriodeSvar.NEI,
                    },
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.VET_IKKE}`),
                        value: JobberIPeriodeSvar.VET_IKKE,
                    },
                ]}
            />
            {arbeidssituasjon.jobberIPerioden === JobberIPeriodeSvar.JA && (
                <FormBlock margin="m">
                    <ResponsivePanel>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidsforholdField.jobberSomVanlig)}
                            legend={getSpørsmål(ArbeidsforholdField.jobberSomVanlig)}
                            useTwoColumns={false}
                            labels={{
                                yes: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.somVanlig', intlValues),
                                no: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.redusert', intlValues),
                            }}
                            // validate={getArbeidJobberSomVanligValidator(intlValues)}
                        />
                        {arbeidssituasjon.jobberSomVanlig === YesOrNo.NO && (
                            <FormBlock>
                                <SoknadFormComponents.YesOrNoQuestion
                                    name={getFieldName(ArbeidsforholdField.erLiktHverUke)}
                                    legend={getSpørsmål(ArbeidsforholdField.erLiktHverUke)}
                                    useTwoColumns={false}
                                    labels={{
                                        yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.erLikt`),
                                        no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.varierer`),
                                    }}
                                    // validate={getArbeidErLiktHverUkeValidator(intlValues)}
                                />
                            </FormBlock>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodenSpørsmål;
