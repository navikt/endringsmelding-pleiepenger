import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knappelenke from '@navikt/sif-common-core/lib/components/knappelenke/Knappelenke';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Kvittering from '../../components/kvittering/Kvittering';
import KvitteringPunktListe from '../../components/kvittering/KvitteringPunktListe';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';

const KvitteringPage: React.FunctionComponent = () => {
    const intl = useIntl();
    useLogSidevisning('søknad-sendt');

    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering
                tittel={
                    <>
                        <p style={{ margin: '0 0 .5rem 0' }}>Takk!</p>
                        Melding om endring er mottatt!
                    </>
                }>
                <p>Når vi har behandlet meldingen fra deg, får du svar fra oss på Dine pleiepenger.</p>
                <p>Hvis du har registrert deg mot å motta digital post, får du svaret tilsendt i posten.</p>
                <Box margin="xl" padBottom="xl">
                    <KvitteringPunktListe
                        tittel={'På Dine pleiepenger kan du i tillegg:'}
                        punkter={['Ettersende dokumentasjon', 'Melde fra om endringer', 'Få informasjon om saksgang']}
                    />
                </Box>

                <Knappelenke type="hoved" href={getEnvironmentVariable('INNSYN_URL')}>
                    Gå til dine pleiepenger
                </Knappelenke>
            </Kvittering>
        </Page>
    );
};

export default KvitteringPage;
