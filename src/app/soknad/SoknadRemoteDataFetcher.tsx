import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import ErrorGuide from '@navikt/sif-common-core/lib/components/error-guide/ErrorGuide';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import { Ingress } from 'nav-frontend-typografi';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import VelgSakPage from '../pages/velg-sak-page/VelgSakPage';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { Sak } from '../types/Sak';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import { kontrollerTilgangTilDialog, StoppÅrsak } from '../utils/gatekeeper';
import { getSakMedMetadata } from '../utils/sakUtils';
import Soknad from './Soknad';

const handleStoppÅrsak = (stoppÅrsak: StoppÅrsak): JSX.Element => {
    switch (stoppÅrsak) {
        case StoppÅrsak.harIngenSak:
            return (
                <ErrorPage
                    pageTitle="Ingen sak funnet"
                    bannerTitle="Ingen sak funnet"
                    contentRenderer={() => (
                        <ErrorGuide title="Ingen sak funnet">
                            <Ingress>Vi kunne ikke finne noen pleiepengesak registrert på deg.</Ingress>
                        </ErrorGuide>
                    )}
                />
            );
        case StoppÅrsak.harFlereSaker:
        case StoppÅrsak.harPrivatArbeidsgiver:
            return <IkkeTilgangPage stoppÅrsak={stoppÅrsak} />;
    }
};

const getSakSomSkalEndres = (saker: Sak[], soknadTempStorage?: SoknadTempStorageData): Sak | undefined => {
    if (saker.length === 1) {
        return saker[0];
    }
    if (soknadTempStorage) {
        return saker.find((s) => {
            return s.barn.aktørId === soknadTempStorage?.formData?.sakBarnAktørid;
        });
    }
    return undefined;
};

export const getArbeidsgivereISak = (arbeidsgivere: Arbeidsgiver[], sak: Sak): Arbeidsgiver[] => {
    const { arbeidstakerMap } = sak.ytelse.arbeidstid;
    if (arbeidstakerMap === undefined) {
        return [];
    }
    return arbeidsgivere.filter((a) => {
        return arbeidstakerMap[a.id] !== undefined;
    });
};

const SoknadRemoteDataFetcher = (): JSX.Element => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();
    const { logInfo } = useAmplitudeInstance();

    const [valgtSak, setValgtSak] = useState<Sak>();

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
            success={([person, saker, arbeidsgivere, soknadTempStorage]): React.ReactNode => {
                const stoppÅrsak = kontrollerTilgangTilDialog(saker, arbeidsgivere);
                if (stoppÅrsak) {
                    appSentryLogger.logInfo('stoppet', stoppÅrsak);
                    logInfo({ stoppet: { stoppÅrsak } });
                    return handleStoppÅrsak(stoppÅrsak);
                }

                /** Kode nedenfor kan tas i bruk når en skal støtte flere saker */
                const sakSomSkalEndres = getSakSomSkalEndres(saker, soknadTempStorage) || valgtSak;
                if (sakSomSkalEndres) {
                    return (
                        <Soknad
                            søker={person}
                            arbeidsgivere={getArbeidsgivereISak(arbeidsgivere, sakSomSkalEndres)}
                            sakMedMeta={getSakMedMetadata(sakSomSkalEndres)}
                            tempStorage={soknadTempStorage}
                        />
                    );
                }

                return (
                    <VelgSakPage
                        saker={saker}
                        onVelgSak={(sak: Sak) => {
                            setTimeout(() => {
                                setValgtSak(sak);
                            });
                        }}
                    />
                );
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
