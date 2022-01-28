import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
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
            </Kvittering>
        </Page>
    );
};

export default KvitteringPage;
