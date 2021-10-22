import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { DateRange } from '@navikt/sif-common-formik/lib';
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
import { Person } from '../types/Person';
import { SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { mapFormDataToApiData } from '../utils/map-form-data-to-api-data/mapFormDataToApiData';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import OmsorgstilbudStep from './omsorgstilbud-step/OmsorgstilbudStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import VelkommenPage from './velkommen-page/VelkommenPage';
import { K9Sak } from '../types/K9Sak';

interface Props {
    soknadId?: string;
    søker: Person;
    endringsdato: Date;
    endringsperiode: DateRange;
    arbeidsgivere?: Arbeidsgiver[];
    k9sak: K9Sak;
}

const SoknadRoutes: React.FunctionComponent<Props> = ({
    soknadId,
    søker,
    endringsperiode,
    endringsdato,
    arbeidsgivere,
    k9sak,
}) => {
    const intl = useIntl();
    const history = useHistory();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values, søker);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();
    const { persist } = usePersistSoknad(history);

    const [persistRequest, setPersistRequest] = useState<{ stepID: StepID } | undefined>();

    useEffect(() => {
        if (soknadId) {
            if (persistRequest) {
                setPersistRequest(undefined);
                persist(soknadId, persistRequest.stepID, { søker });
            }
        }
    }, [soknadId, persistRequest, persist, søker]);

    const renderSoknadStep = (soknadId: string, søker: Person, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.OMSORGSTILBUD:
                return (
                    <OmsorgstilbudStep
                        endringsdato={endringsdato}
                        søknadsperioder={
                            k9sak.ytelse.søknadsperioder
                        } /** Todo - fjerne deler av perioder som er utenfor endringesperiode */
                        tidIOmsorgstilbudSak={k9sak.ytelse.tilsynsordning.enkeltdager}
                        onOmsorgstilbudChanged={() => {
                            setPersistRequest({ stepID: StepID.OMSORGSTILBUD });
                        }}
                    />
                );
            case StepID.ARBEIDSSITUASJON:
                return <ArbeidssituasjonStep />;
            case StepID.ARBEIDSTID:
                return (
                    <ArbeidstidStep
                        arbeidsgivere={arbeidsgivere}
                        søknadsperioder={k9sak.ytelse.søknadsperioder}
                        endringsdato={endringsdato}
                        arbeidstidSak={k9sak.ytelse.arbeidstid}
                        onArbeidstidChanged={() => {
                            setPersistRequest({ stepID: StepID.ARBEIDSTID });
                        }}
                    />
                );
            case StepID.OPPSUMMERING:
                const apiValues = mapFormDataToApiData(
                    {
                        soknadId: soknadId,
                        locale: intl.locale,
                        formData: values,
                    },
                    endringsperiode,
                    k9sak
                );
                return (
                    <OppsummeringStep
                        apiValues={apiValues}
                        søker={søker}
                        tidIOmsorgstilbudSak={k9sak.ytelse.tilsynsordning.enkeltdager}
                    />
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
                <VelkommenPage endringsperiode={endringsperiode} />
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
