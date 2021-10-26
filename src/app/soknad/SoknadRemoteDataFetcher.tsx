import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import { trimK9SakForSøknad } from '../utils/k9utils';
import Soknad from './Soknad';
import { K9Sak, K9SakMeta } from '../types/K9Sak';

const SoknadRemoteDataFetcher = (): JSX.Element => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    const [sakState, setSakState] = useState<{ sak: K9Sak; meta: K9SakMeta }>();

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
                if (!sakState) {
                    setTimeout(() => {
                        setSakState(trimK9SakForSøknad(k9sak));
                    }, 0);
                    return <span />;
                } else {
                    return (
                        <Soknad
                            søker={person}
                            arbeidsgivere={arbeidsgivere}
                            k9sak={sakState.sak}
                            k9sakMeta={sakState.meta}
                            soknadTempStorage={soknadTempStorage}
                        />
                    );
                }
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
