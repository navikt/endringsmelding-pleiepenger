import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isFailure, isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { K9Sak } from '../../types/K9Sak';
import { Person } from '../../types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormField } from '../../types/SoknadFormData';
import appSentryLogger from '../../utils/appSentryLogger';
import { verifySoknadApiData } from '../../validation/verifySoknadApiData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidSummary from './arbeidstid-summary/ArbeidstidSummary';
import OmsorgstilbudSummary from './omsorgstilbud-summary/OmsorgstilbudSummary';
import SøkerSummary from './SøkerSummary';

type Props = {
    apiValues?: SoknadApiData;
    søker: Person;
    arbeidsgivere: Arbeidsgiver[];
    k9sak: K9Sak;
};

const OppsummeringStep: React.FunctionComponent<Props> = ({ søker, apiValues, arbeidsgivere, k9sak }) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const apiDataValidationResult = verifySoknadApiData(apiValues, k9sak);

    useEffect(() => {
        if (apiDataValidationResult.isValid === false) {
            appSentryLogger.logError('apiValues not valid', JSON.stringify(apiDataValidationResult.errors));
        }
    }, []);

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status) || apiDataValidationResult.isValid === false}
            onSendSoknad={
                apiValues
                    ? () => {
                          sendSoknad(apiValues);
                      }
                    : undefined
            }>
            <Box margin="xxxl">
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <FormattedMessage id="step.oppsummering.info" />
                </Guide>
                {apiValues === undefined && (
                    <Box margin="xl">
                        <AlertStripeFeil>
                            <FormattedMessage id="oppsummering.advarsel.ingenApiValues" />
                        </AlertStripeFeil>
                    </Box>
                )}
                {apiValues !== undefined && apiDataValidationResult.isValid === false && (
                    <FormBlock>
                        <AlertStripeFeil>
                            <FormattedMessage id="oppsummering.advarsel.invalidApiValues" />
                        </AlertStripeFeil>
                    </FormBlock>
                )}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} />
                                {apiValues.ytelse.tilsynsordning && (
                                    <OmsorgstilbudSummary
                                        tilsynsordning={apiValues.ytelse.tilsynsordning}
                                        tidIOmsorgstilbudSak={k9sak.ytelse.tilsynsordning.enkeltdager}
                                    />
                                )}
                                {apiValues.ytelse.arbeidstid &&
                                    apiValues.ytelse.arbeidstid.arbeidstakerList.length > 0 &&
                                    arbeidsgivere && (
                                        <ArbeidstidSummary
                                            arbeidstid={apiValues.ytelse.arbeidstid}
                                            arbeidstidK9={k9sak.ytelse.arbeidstid}
                                            arbeidsgivere={arbeidsgivere}
                                        />
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
