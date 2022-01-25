import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { useFormikContext } from 'formik';
import AppRoutes from '../config/routeConfig';
import usePersistSoknad from '../hooks/usePersistSoknad';
import KvitteringPage from '../pages/kvittering-page/KvitteringPage';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { SakMedMeta } from '../types/Sak';
import { SoknadFormData } from '../types/SoknadFormData';
import { Søker } from '../types/Søker';
import appSentryLogger from '../utils/appSentryLogger';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { mapFormDataToK9Format } from '../utils/map-form-data-to-api-data/mapFormDataToK9Format';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import OmsorgstilbudStep from './omsorgstilbud-step/OmsorgstilbudStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import VelkommenPage from './velkommen-page/VelkommenPage';

interface Props {
    soknadId?: string;
    søker: Søker;
    arbeidsgivere?: Arbeidsgiver[];
    sakMedMeta: SakMedMeta;
}

const SoknadRoutes: React.FunctionComponent<Props> = ({ soknadId, søker, arbeidsgivere, sakMedMeta }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();
    const { persist } = usePersistSoknad();

    const { sak, meta: sakMeta } = sakMedMeta;

    const [persistRequest, setPersistRequest] = useState<{ stepID: StepID } | undefined>();

    const doPersist = useCallback(
        (stepID: StepID) => {
            if (soknadId) {
                /** Dobbeltlagrer enn så lenge pga lagring i sif-common-soknad */
                persist(soknadId, stepID, {
                    søker,
                    sak,
                });
            }
        },
        [søker, sak, persist, soknadId]
    );

    useEffect(() => {
        if (soknadId) {
            if (persistRequest) {
                doPersist(persistRequest.stepID);
                setPersistRequest(undefined);
            }
        }
    }, [soknadId, doPersist, persistRequest, persist, søker, sak, arbeidsgivere]);

    const renderSoknadStep = (soknadId: string, søker: Søker, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.ARBEIDSTID:
                return (
                    <ArbeidstidStep
                        arbeidsgivere={arbeidsgivere}
                        arbeidstidSøknad={values.arbeidstid}
                        arbeidstidSak={sak.ytelse.arbeidstid}
                        sakMetadata={sakMeta}
                        onArbeidstidChanged={() => {
                            setPersistRequest({ stepID: StepID.ARBEIDSTID });
                        }}
                    />
                );
            case StepID.OMSORGSTILBUD:
                return (
                    <OmsorgstilbudStep
                        sakMetadata={sakMeta}
                        tidIOmsorgstilbudSak={sak.ytelse.tilsynsordning.enkeltdager}
                        onOmsorgstilbudChanged={() => {
                            setPersistRequest({ stepID: StepID.OMSORGSTILBUD });
                        }}
                    />
                );
            case StepID.OPPSUMMERING:
                let apiValues = undefined;
                try {
                    apiValues = mapFormDataToK9Format(
                        {
                            soknadId: soknadId,
                            locale: intl.locale,
                            formData: values,
                        },
                        sak.ytelse.søknadsperioder,
                        sak
                    );
                } catch (error) {
                    appSentryLogger.logError('mapFormDataToK9Format', error);
                }
                if (apiValues) {
                    doPersist(StepID.OMSORGSTILBUD);
                }
                return apiValues ? (
                    <OppsummeringStep
                        arbeidsgivere={arbeidsgivere || []}
                        apiValues={apiValues}
                        sak={sak}
                        hvaSkalEndres={values.hvaSkalEndres}
                    />
                ) : (
                    <ErrorPage />
                );
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];
    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            <Route path={AppRoutes.SOKNAD_SENT} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={(): React.ReactNode => {
                        if (isSuccess(sendSoknadStatus.status)) {
                            return <KvitteringPage />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>
            <Route path={AppRoutes.SOKNAD} exact={true}>
                <VelkommenPage />
            </Route>
            {soknadId === undefined && <Redirect key="redirectToWelcome" to={AppRoutes.SOKNAD} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={(): React.ReactNode => renderSoknadStep(soknadId, søker, step)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={(): JSX.Element => {
                        console.warn('Route not found');
                        return <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />;
                    }}></ErrorPage>
            </Route>
        </Switch>
    );
};
export default SoknadRoutes;
