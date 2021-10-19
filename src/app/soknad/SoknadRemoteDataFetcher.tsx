import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import Soknad from './Soknad';

const SoknadRemoteDataFetcher = (): JSX.Element => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    return (
        <RemoteDataHandler<SoknadEssentials>
            remoteData={soknadEssentials}
            initializing={(): React.ReactNode => <LoadingPage />}
            loading={(): React.ReactNode => <LoadingPage />}
            error={(): React.ReactNode => (
                <ErrorPage
                    bannerTitle={intlHelper(intl, 'application.title')}
                    contentRenderer={(): JSX.Element => <SoknadErrorMessages.GeneralApplicationError />}
                />
            )}
            success={([person, k9sak, arbeidsgivere, soknadTempStorage]): React.ReactNode => {
                return (
                    <Soknad
                        søker={person}
                        arbeidsgivere={arbeidsgivere}
                        k9sak={k9sak}
                        soknadTempStorage={soknadTempStorage}
                    />
                );
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
