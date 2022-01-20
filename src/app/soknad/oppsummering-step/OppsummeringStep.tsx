import { isFailure, isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { Sak } from '../../types/Sak';
import { SoknadApiData } from '../../types/SoknadApiData';
import { HvaSkalEndres, SoknadFormField } from '../../types/SoknadFormData';
import appSentryLogger from '../../utils/appSentryLogger';
import { verifySoknadApiData } from '../../validation/verifySoknadApiData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { skalEndreArbeidstid, skalEndreOmsorgstilbud, StepID } from '../soknadStepsConfig';
import ArbeidstidSummary from './arbeidstid-summary/ArbeidstidSummary';
import OmsorgstilbudSummary from './omsorgstilbud-summary/OmsorgstilbudSummary';

type Props = {
    apiValues: SoknadApiData;
    arbeidsgivere: Arbeidsgiver[];
    sak: Sak;
    hvaSkalEndres: HvaSkalEndres[];
};

const OppsummeringStep: React.FunctionComponent<Props> = ({ apiValues, arbeidsgivere, sak, hvaSkalEndres }) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const apiDataValidationResult = verifySoknadApiData(apiValues, sak);

    useEffect(() => {
        if (apiDataValidationResult.isValid === false) {
            appSentryLogger.logError('apiValues not valid', JSON.stringify(apiDataValidationResult.errors));
        }
    }, [apiDataValidationResult]);

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status) || apiDataValidationResult.isValid === false}
            onSendSoknad={() => {
                sendSoknad(apiValues);
            }}>
            <Box margin="xxxl">
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <FormattedMessage id="step.oppsummering.info" />
                </Guide>
                {apiDataValidationResult.isValid === false && (
                    <FormBlock>
                        <AlertStripeFeil>
                            <FormattedMessage id="oppsummering.advarsel.invalidApiValues" />
                        </AlertStripeFeil>
                    </FormBlock>
                )}
                {apiDataValidationResult.isValid === true && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                {apiValues.ytelse.arbeidstid !== undefined && (
                                    <ArbeidstidSummary
                                        arbeidstid={apiValues.ytelse.arbeidstid}
                                        arbeidstidK9={sak.ytelse.arbeidstid}
                                        arbeidsgivere={arbeidsgivere}
                                    />
                                )}
                                {apiValues.ytelse.arbeidstid == undefined && skalEndreArbeidstid({ hvaSkalEndres }) && (
                                    <SummarySection header="Endret arbeidstid">
                                        <Box>
                                            <p>Ingen endringer i arbeidstid.</p>
                                        </Box>
                                    </SummarySection>
                                )}
                                {apiValues.ytelse.tilsynsordning && (
                                    <OmsorgstilbudSummary
                                        tilsynsordning={apiValues.ytelse.tilsynsordning}
                                        tidIOmsorgstilbudSak={sak.ytelse.tilsynsordning.enkeltdager}
                                    />
                                )}
                                {apiValues.ytelse.tilsynsordning == undefined &&
                                    skalEndreOmsorgstilbud({ hvaSkalEndres }) && (
                                        <SummarySection header="Endret tid i omsorgstilbud">
                                            <Box>
                                                <p>Ingen endringer registrert</p>
                                            </Box>
                                        </SummarySection>
                                    )}
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </>
                )}
            </Box>
            {isFailure(sendSoknadStatus.status) && (
                <FormBlock>
                    {sendSoknadStatus.failures === 1 && (
                        <AlertStripeFeil>
                            <FormattedMessage id="step.oppsummering.sendMelding.feilmelding.førsteGang" />
                        </AlertStripeFeil>
                    )}
                    {sendSoknadStatus.failures === 2 && (
                        <AlertStripeFeil>
                            <FormattedMessage id="step.oppsummering.sendMelding.feilmelding.andreGang" />
                        </AlertStripeFeil>
                    )}
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
