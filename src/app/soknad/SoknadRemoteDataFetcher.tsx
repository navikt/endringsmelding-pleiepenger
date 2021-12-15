import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import { K9SakMedMeta } from '../types/K9Sak';
import { trimK9SakForSøknad } from '../utils/k9SakUtils';
import Soknad from './Soknad';

const SoknadRemoteDataFetcher = (): JSX.Element => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    const [sakState, setSakState] = useState<{ saker: K9SakMedMeta[] }>();

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
                        setSakState({ saker: k9sak.map((sak) => trimK9SakForSøknad(sak)) });
                    }, 0);
                    return <span />;
                } else {
                    return (
                        <Soknad
                            søker={person}
                            arbeidsgivere={arbeidsgivere}
                            k9sak={sakState.saker[0].sak}
                            k9sakMeta={sakState.saker[0].meta}
                            soknadTempStorage={soknadTempStorage}
                        />
                    );
                }
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
