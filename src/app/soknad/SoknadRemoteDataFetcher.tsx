import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import SoknadInngang from './SoknadInngang';

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
            success={([søker, saker, arbeidsgivere, soknadTempStorage]): React.ReactNode => {
                return (
                    <SoknadInngang
                        søker={søker}
                        saker={saker}
                        arbeidsgivere={arbeidsgivere}
                        tempStorageData={soknadTempStorage}
                    />
                );
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
