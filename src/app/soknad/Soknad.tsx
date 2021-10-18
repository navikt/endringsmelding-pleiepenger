import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { SoknadApplicationType, StepConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { ulid } from 'ulid';
import { sendEndringsmelding } from '../api/sendSoknad';
import { SKJEMANAVN } from '../App';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { Arbeidsgivere } from '../types/Arbeidsgiver';
import { K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { getEndringsperiode, getEndringsdato } from '../utils/getEndringsperiode';
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
import { initialSoknadFormData } from './initialSoknadValues';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { getSoknadStepsConfig, StepID } from './soknadStepsConfig';
import soknadTempStorage, { isStorageDataValid } from './soknadTempStorage';
import { getMinMaxInDateRanges } from '../utils/dateUtils';

interface Props {
    søker: Person;
    arbeidsgivere: Arbeidsgivere;
    k9sak: K9Sak;
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

type resetFormFunc = () => void;

const Soknad: React.FunctionComponent<Props> = ({ søker, soknadTempStorage: tempStorage, arbeidsgivere, k9sak }) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const endringsdato = getEndringsdato();
    const søknadsperiode = getMinMaxInDateRanges(k9sak.ytelse.søknadsperioder);
    const endringsperiode = getEndringsperiode(endringsdato, søknadsperiode);
    const { logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = true): Promise<void> => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialSoknadFormData });
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
        await soknadTempStorage.purge();
        await logHendelse(ApplikasjonHendelse.avbryt);
        relocateToSoknad();
    };

    const startSoknad = async (): Promise<void> => {
        await resetSoknad();
        const sId = ulid();
        setSoknadId(sId);
        const firstStep = StepID.OMSORGSTILBUD;
        await soknadTempStorage.create();
        await soknadTempStorage.update(
            sId,
            { harBekreftetOpplysninger: false, harForståttRettigheterOgPlikter: true },
            firstStep,
            { søker }
        );
        await logSoknadStartet(SKJEMANAVN);
        setTimeout(() => {
            navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.MELDING), history);
        });
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData): Promise<void> => {
        await soknadTempStorage.update(sId, values, stepID, { søker });
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToNavFrontpage();
    };

    const doSendSoknad = async (apiValues: SoknadApiData, resetFormikForm: resetFormFunc): Promise<void> => {
        try {
            await sendEndringsmelding(apiValues);
            await soknadTempStorage.purge();
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
        const apiDataIsValid = verifySoknadApiData(apiValues);
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
                await soknadTempStorage.update(soknadId, values, nextStep, { søker });
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
        if (isStorageDataValid(tempStorage, { søker })) {
            setInitialFormData(tempStorage.formData);
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
    }, [history, tempStorage, søker]);

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={(): React.ReactNode => {
                if (søker.myndig === false) {
                    return <IkkeMyndigPage />;
                }
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialFormData}
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
                                        startSoknad,
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
                                        endringsperiode={endringsperiode}
                                        endringsdato={endringsdato}
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
