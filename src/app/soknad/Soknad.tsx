import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import { SoknadApplicationType, StepConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { ulid } from 'ulid';
import { sendEndringsmelding } from '../api/sendSoknad';
import { SKJEMANAVN } from '../App';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { SakMedMeta } from '../types/Sak';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { Søker } from '../types/Søker';
import appSentryLogger from '../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { getInitialFormData } from '../utils/initialFormDataUtils';
import { harSakArbeidstidInfo } from '../utils/sakUtils';
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
import { useEffectOnce } from '../hooks/useEffectOnce';

interface Props {
    søker: Søker;
    arbeidsgivere: Arbeidsgiver[];
    sakMedMeta: SakMedMeta;
    tempStorage: SoknadTempStorageData;
    route?: string;
}

type resetFormFunc = () => void;

const Soknad: React.FunctionComponent<Props> = ({ søker, tempStorage, arbeidsgivere, sakMedMeta }) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);
    const intl = useIntl();

    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const { sak } = sakMedMeta;

    const { logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = false): Promise<void> => {
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
        const firstStep = getAvailableSteps(values)[0];
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await soknadTempStorage.create();
            await soknadTempStorage.update(sId, { ...values }, firstStep, {
                søker,
                sak,
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
                sak,
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
                        sak,
                    });
                }
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

    // useEffect(() => {
    //     const arbeidsforholdIkkeISsak = getNyeArbeidsforholdIkkeRegistrertISak(arbeidsgivere, []);
    //     if (arbeidsforholdIkkeISsak.length > 0) {
    //         setNyeArbeidsforhold(arbeidsforholdIkkeISsak);
    //     }
    // }, [arbeidsgivere]);

    useEffectOnce(() => {
        if (isStorageDataValid(tempStorage, { søker, sak })) {
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
    });

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={(): React.ReactNode => {
                if (harSakArbeidstidInfo(arbeidsgivere, sakMedMeta.sak.ytelse.arbeidstid) === false) {
                    appSentryLogger.logError(
                        'harSakArbeidstidInfo - info om arbeidstid mangler eller usynk mellom aareg og sak'
                    );
                    return (
                        <ErrorPage
                            bannerTitle={intlHelper(intl, 'application.title')}
                            contentRenderer={() => <>Informasjon om arbeidstid mangler - usynk mellom aareg og sak</>}
                        />
                    );
                }
                const initialData = getInitialFormData(sakMedMeta.sak, søker, tempStorage);
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
