import * as React from 'react';
import { render } from 'react-dom';
import { Redirect, Route } from 'react-router-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import SoknadApplication from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplication';
import SoknadApplicationCommonRoutes from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplicationCommonRoutes';
import Modal from 'nav-frontend-modal';
import { applicationIntlMessages } from './i18n/applicationMessages';
import SoknadRemoteDataFetcher from './soknad/SoknadRemoteDataFetcher';
import { getEnvVariableOrDefault } from './utils/envUtils';
import '@navikt/sif-common-core/lib/styles/globalStyles.less';
import './styles/app.less';

Modal.setAppElement('#app');

export const APPLICATION_KEY = 'endringsmelding-pleiepenger';
export const SKJEMANAVN = 'Endringsmelding - pleiepenger';

const root = document.getElementById('app');
const publicPath = getEnvVariableOrDefault('PUBLIC_PATH', '/');

function prepare() {
    if (getEnvironmentVariable('APP_VERSION') !== 'production') {
        if (getEnvVariableOrDefault('MSW_MODE', 'test') === 'test') {
            return import('../../mocks/msw/browser').then(({ worker }) =>
                worker.start({ onUnhandledRequest: 'bypass' })
            );
        }
    }
    return Promise.resolve();
}

const App = () => (
    <AmplitudeProvider applicationKey={APPLICATION_KEY} isActive={getEnvironmentVariable('USE_AMPLITUDE') === 'true'}>
        <SoknadApplication
            appName="Overføring av omsorgsdager"
            intlMessages={applicationIntlMessages}
            sentryKey={APPLICATION_KEY}
            appStatus={{
                applicationKey: APPLICATION_KEY,
                sanityConfig: {
                    projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                    dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
                },
            }}
            publicPath={publicPath}>
            <SoknadApplicationCommonRoutes
                contentRoutes={[
                    <Redirect key="rootRedirect" path="/" exact={true} to={'/melding'} />,
                    <Route key="innlogget" path="/melding" component={SoknadRemoteDataFetcher} />,
                ]}
            />
        </SoknadApplication>
    </AmplitudeProvider>
);

prepare().then(() => {
    render(<App />, root);
});
