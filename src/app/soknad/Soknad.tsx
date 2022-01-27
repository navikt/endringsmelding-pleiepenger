import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { SoknadApplicationType, StepConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import { sendEndringsmelding } from '../api/sendSoknad';
import { SKJEMANAVN } from '../App';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { SakMedMeta } from '../types/Sak';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { Søker } from '../types/Søker';
import appSentryLogger from '../utils/appSentryLogger';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { verifySoknadApiData } from '../validation/verifySoknadApiData';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { getSoknadStepsConfig, StepID } from './soknadStepsConfig';
import soknadTempStorage from './soknadTempStorage';
import { useEffectOnce } from '../hooks/useEffectOnce';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';

interface Props {
    søker: Søker;
    arbeidsgivere: Arbeidsgiver[];
    sakMedMeta: SakMedMeta;
    formData: Partial<SoknadFormData>;
    stepID: StepID;
    soknadId: string;
}

type resetFormFunc = () => void;

const Soknad: React.FunctionComponent<Props> = ({ søker, arbeidsgivere, sakMedMeta, soknadId, formData, stepID }) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);

    const { sak } = sakMedMeta;

    const { logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const abortSoknad = async (): Promise<void> => {
        await logHendelse(ApplikasjonHendelse.avbryt);
        await soknadTempStorage.purge();
        relocateToSoknad();
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData): Promise<void> => {
        await soknadTempStorage.update(sId, values, stepID, {
            søker,
            sak,
        });
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToNavFrontpage();
    };

    const doSend = async (apiValues: SoknadApiData, resetFormikForm: resetFormFunc): Promise<void> => {
        try {
            await sendEndringsmelding(apiValues);
            await soknadTempStorage.purge();
            setSendSoknadStatus({ failures: 0, status: success(apiValues) });
            navigateToKvitteringPage(history);
            resetFormikForm();
        } catch (error) {
            if (isUnauthorized(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed(SKJEMANAVN);
                if (sendSoknadStatus.failures >= 2) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        failures: sendSoknadStatus.failures + 1,
                        status: failure(error),
                    });
                }
            }
        }
    };

    const triggerSend = async (apiValues: SoknadApiData, resetForm: resetFormFunc): Promise<void> => {
        const apiDataIsValid = verifySoknadApiData(apiValues, sakMedMeta.sak);
        if (apiDataIsValid) {
            setTimeout(() => {
                setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
                setTimeout(() => {
                    doSend(apiValues, resetForm);
                });
            });
        } else {
            await appSentryLogger.logError('ApiVerificationFailed');
            navigateToErrorPage(history);
        }
    };

    const persistAndNavigate = async (
        values: SoknadFormData,
        step: StepConfig<StepID>,
        nextStep?: StepID
    ): Promise<void> => {
        if (nextStep && soknadId) {
            try {
                await soknadTempStorage.update(soknadId, values, nextStep, {
                    søker,
                    sak,
                });
            } catch (error) {
                if (isUnauthorized(error)) {
                    await logUserLoggedOut('ved mellomlagring');
                    relocateToLoginPage();
                }
            }
        }
        setTimeout(() => {
            if (step.nextStepRoute) {
                navigateTo(step.nextStepRoute, history);
            }
        });
    };

    useEffectOnce(() => {
        const currentRoute = history.location.pathname;
        if (currentRoute !== soknadStepUtils.getStepRoute(stepID, SoknadApplicationType.MELDING)) {
            setTimeout(() => {
                navigateTo(soknadStepUtils.getStepRoute(stepID, SoknadApplicationType.MELDING), history);
                setInitializing(false);
            });
        } else {
            setInitializing(false);
        }
    });

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={(): React.ReactNode => {
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={formData}
                        onSubmit={() => null}
                        renderForm={({ values, resetForm }) => {
                            const soknadStepsConfig = getSoknadStepsConfig(values);
                            return (
                                <SoknadContextProvider
                                    value={{
                                        soknadId,
                                        soknadStepsConfig,
                                        sendSoknadStatus,
                                        resetSoknad: abortSoknad,
                                        continueSoknadLater: soknadId
                                            ? (stepId) => continueSoknadLater(soknadId, stepId, values)
                                            : undefined,
                                        startSoknad: () => null, // Søknad startes fra SoknadInngang
                                        sendSoknad: (values) => triggerSend(values, resetForm),
                                        gotoNextStepFromStep: (stepId: StepID) => {
                                            persistAndNavigate(
                                                values,
                                                soknadStepsConfig[stepId],
                                                soknadStepsConfig[stepId].nextStep
                                            );
                                        },
                                    }}>
                                    <SoknadRoutes
                                        soknadId={soknadId}
                                        søker={søker}
                                        arbeidsgivere={arbeidsgivere}
                                        sakMedMeta={sakMedMeta}
                                    />
                                </SoknadContextProvider>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
