import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import { SoknadApplicationType, StepConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { ulid } from 'ulid';
import { sendEndringsmelding } from '../api/sendSoknad';
import { SKJEMANAVN } from '../App';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9Sak, K9SakMeta } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { getInitialFormData } from '../utils/initialFormDataUtils';
import { k9ArbeidsgivereFinnesIAAreg } from '../utils/k9SakUtils';
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
import soknadTempStorage, { isStorageDataValid } from './soknadTempStorage';

interface Props {
    søker: Person;
    arbeidsgivere: Arbeidsgiver[];
    k9sak: K9Sak;
    k9sakMeta: K9SakMeta;
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

type resetFormFunc = () => void;

const Soknad: React.FunctionComponent<Props> = ({
    søker,
    soknadTempStorage: tempStorage,
    arbeidsgivere,
    k9sak,
    k9sakMeta,
}) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);
    const intl = useIntl();

    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const {
        ytelse: { søknadsperioder: k9søknadsperioder },
    } = k9sak;

    const { logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = true): Promise<void> => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await soknadTempStorage.purge();
        }
        setSoknadId(undefined);
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(AppRoutes.SOKNAD)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        } else {
            setInitializing(false);
        }
    };

    const abortSoknad = async (): Promise<void> => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await soknadTempStorage.purge();
        }
        await logHendelse(ApplikasjonHendelse.avbryt);
        relocateToSoknad();
    };

    const startSoknad = async (values: SoknadFormData): Promise<void> => {
        await resetSoknad();
        const sId = ulid();
        setSoknadId(sId);

        const firstStep = getAvailableSteps(values, søker)[0];

        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await soknadTempStorage.create();
            await soknadTempStorage.update(sId, { ...values }, firstStep, {
                søker,
                arbeidsgivere,
                k9søknadsperioder: k9søknadsperioder,
            });
        }
        await logSoknadStartet(SKJEMANAVN);
        setTimeout(() => {
            navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.MELDING), history);
        });
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData): Promise<void> => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await soknadTempStorage.update(sId, values, stepID, {
                søker,
                arbeidsgivere,
                k9søknadsperioder: k9søknadsperioder,
            });
        }
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToNavFrontpage();
    };

    const doSendSoknad = async (apiValues: SoknadApiData, resetFormikForm: resetFormFunc): Promise<void> => {
        try {
            await sendEndringsmelding(apiValues);
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                await soknadTempStorage.purge();
            }
            setSendSoknadStatus({ failures: 0, status: success(apiValues) });
            navigateToKvitteringPage(history);
            setSoknadId(undefined);
            resetFormikForm();
        } catch (error) {
            if (isUserLoggedOut(error)) {
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
        const apiDataIsValid = verifySoknadApiData(apiValues, k9sak);
        if (apiDataIsValid) {
            setTimeout(() => {
                setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
                setTimeout(() => {
                    doSendSoknad(apiValues, resetForm);
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
                if (isFeatureEnabled(Feature.PERSISTENCE)) {
                    await soknadTempStorage.update(soknadId, values, nextStep, {
                        søker,
                        arbeidsgivere,
                        k9søknadsperioder: k9søknadsperioder,
                    });
                }
            } catch (error) {
                if (isUserLoggedOut(error)) {
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

    useEffect(() => {
        if (isStorageDataValid(tempStorage, { søker, arbeidsgivere, k9søknadsperioder: k9søknadsperioder })) {
            setSoknadId(tempStorage.metadata.soknadId);
            const currentRoute = history.location.pathname;
            const lastStepRoute = soknadStepUtils.getStepRoute(
                tempStorage.metadata.lastStepID,
                SoknadApplicationType.MELDING
            );
            if (currentRoute !== lastStepRoute) {
                setTimeout(() => {
                    navigateTo(
                        soknadStepUtils.getStepRoute(tempStorage.metadata.lastStepID, SoknadApplicationType.MELDING),
                        history
                    );
                    setInitializing(false);
                });
            } else {
                setInitializing(false);
            }
        } else {
            resetSoknad(history.location.pathname !== AppRoutes.SOKNAD);
        }
    }, [history, tempStorage, søker, arbeidsgivere, k9søknadsperioder]);

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={(): React.ReactNode => {
                if (søker.myndig === false) {
                    return <IkkeMyndigPage />;
                }
                if (k9ArbeidsgivereFinnesIAAreg(arbeidsgivere, k9sak.ytelse.arbeidstid.arbeidsgivereMap) === false) {
                    return (
                        <ErrorPage
                            bannerTitle={intlHelper(intl, 'application.title')}
                            contentRenderer={() => <>Informasjon om arbeidsgivere mangler</>}
                        />
                    );
                }
                const initialData = getInitialFormData(k9sak, søker, arbeidsgivere, tempStorage);
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialData}
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
                                        startSoknad: () => startSoknad(values),
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
                                        k9sak={k9sak}
                                        k9sakMeta={k9sakMeta}
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
