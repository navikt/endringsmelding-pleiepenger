import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knappelenke from '@navikt/sif-common-core/lib/components/knappelenke/Knappelenke';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Kvittering from '../../components/kvittering/Kvittering';

const KvitteringPage: React.FunctionComponent = () => {
    const intl = useIntl();
    useLogSidevisning('søknad-sendt');

    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering tittel={<>Melding om endring er mottatt!</>}>
                <p>Når vi har behandlet meldingen fra deg, får du svar fra oss på Ditt NAV.</p>
                <p>Hvis du har registrert deg mot å motta digital post, får du svaret tilsendt i posten.</p>
                <Box margin="xl">
                    <Knappelenke type="hoved" href={getEnvironmentVariable('INNSYN_URL')}>
                        Gå til dine pleiepenger
                    </Knappelenke>
                </Box>
            </Kvittering>
        </Page>
    );
};

export default KvitteringPage;
