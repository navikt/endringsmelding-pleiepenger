import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isFailure, isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Person } from '../../types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormField, TidEnkeltdag } from '../../types/SoknadFormData';
import { verifySoknadApiData } from '../../validation/verifySoknadApiData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SøkerSummary from './SøkerSummary';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import OmsorgstilbudSummary from './omsorgstilbud-summary/OmsorgstilbudSummary';
import ItsClosedGiffy from './ItsClosedGiffy';

type Props = {
    søker: Person;
    tidIOmsorgstilbudSak?: TidEnkeltdag;
    apiValues?: SoknadApiData;
};

const OppsummeringStep: React.FunctionComponent<Props> = ({ søker, apiValues, tidIOmsorgstilbudSak }) => {
    const intl = useIntl();
    const { sendSoknadStatus } = useSoknadContext();
    const [showGiffy, setShowGiffy] = useState(false);
    const apiDataIsValid = apiValues !== undefined && verifySoknadApiData(apiValues);
    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status) || apiDataIsValid === false}
            onSendSoknad={
                apiValues
                    ? (): void => {
                          setShowGiffy(true);
                          setTimeout(() => {
                              setShowGiffy(false);
                          }, 8000);
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
                {apiValues !== undefined && apiDataIsValid === false && (
                    <AlertStripeFeil>
                        <FormattedMessage id="oppsummering.advarsel.invalidApiValues" />
                    </AlertStripeFeil>
                )}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} />
                                <OmsorgstilbudSummary
                                    omsorgstilbud={apiValues.omsorgstilbud}
                                    tidIOmsorgstilbudSak={tidIOmsorgstilbudSak}
                                />
                            </ResponsivePanel>
                        </Box>

                        {showGiffy && <ItsClosedGiffy />}

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
