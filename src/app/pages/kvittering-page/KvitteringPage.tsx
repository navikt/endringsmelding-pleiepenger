import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Kvittering from '@navikt/sif-common-core/lib/components/kvittering/Kvittering';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import WeAreWorkingOnIt from '../../soknad/oppsummering-step/WeAreWorkingOnIt';

const KvitteringPage: React.FunctionComponent = () => {
    const intl = useIntl();
    useLogSidevisning('søknad-sendt');

    const [showKitty, doShowKitty] = useState<boolean>(false);
    useEffect(() => {
        setTimeout(() => doShowKitty(true), 4000);
    }, []);
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering
                tittel={'Endringsmelding mottatt'}
                liste={{
                    tittel: 'Da har vi en tittel på en liste',
                    punkter: [
                        'Og noen punkter i listen',
                        '... to faktisk',
                        ...(showKitty
                            ? [
                                  <>
                                      ... og en katt da
                                      <WeAreWorkingOnIt />
                                  </>,
                              ]
                            : []),
                    ],
                }}></Kvittering>
        </Page>
    );
};

export default KvitteringPage;
