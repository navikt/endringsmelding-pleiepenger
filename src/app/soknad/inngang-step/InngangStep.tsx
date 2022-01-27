import { useAmplitudeInstance, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import { useIntl } from 'react-intl';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { Sak } from '../../types/Sak';
import OmEndringsdialogInfo from './OmEndringsdialogInfo';
import InngangForm from './inngang-form/InngangForm';
import appSentryLogger from '../../utils/appSentryLogger';
import { kontrollerTilgangTilDialog } from '../../utils/gatekeeper';
import StoppInfo from './stopp-info/StoppInfo';
import { HvaSkalEndres } from '../../types';

interface Props {
    saker: Sak[];
    arbeidsgivere: Arbeidsgiver[];
    onStart: (sak: Sak, hvaSkalEndres: HvaSkalEndres[]) => void;
}

const InngangStep: React.FunctionComponent<Props> = ({ saker, arbeidsgivere, onStart }) => {
    const intl = useIntl();
    useLogSidevisning('velkommen');
    const { logInfo } = useAmplitudeInstance();

    const stoppÅrsak = kontrollerTilgangTilDialog(saker, arbeidsgivere);
    if (stoppÅrsak) {
        appSentryLogger.logInfo('stoppet', stoppÅrsak);
        logInfo({ stoppet: { stoppÅrsak } });
    }

    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Box margin="xl" textAlignCenter={true}>
                <Sidetittel>Melde endring i pleiepengeperioden</Sidetittel>
            </Box>
            <section role="contentinfo" aria-label="Introduksjon">
                <Box margin="xl" textAlignCenter={true}>
                    <CounsellorPanel>
                        <OmEndringsdialogInfo />
                    </CounsellorPanel>
                </Box>
            </section>
            {stoppÅrsak ? (
                <Box margin="xl">
                    <StoppInfo stoppÅrsak={stoppÅrsak} />
                </Box>
            ) : (
                <Box margin="xl">
                    <InngangForm saker={saker} onStart={({ sak, hvaSkalEndres }) => onStart(sak, hvaSkalEndres)} />
                </Box>
            )}
        </Page>
    );
};

export default InngangStep;
