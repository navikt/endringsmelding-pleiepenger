import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sidetittel } from 'nav-frontend-typografi';
import { useSoknadContext } from '../SoknadContext';
import VelkommenPageForm from './velkommen-page-form/VelkommenPageForm';
import VelkommenInfo from './VelkommenInfo';

const VelkommenPage = () => {
    const intl = useIntl();
    const { startSoknad } = useSoknadContext();
    useLogSidevisning('velkommen');
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Box margin="xl" textAlignCenter={true}>
                <Sidetittel>Melde endring i pleiepengeperioden</Sidetittel>
            </Box>
            <section role="contentinfo" aria-label="Introduksjon">
                <Box margin="xl" textAlignCenter={true}>
                    <CounsellorPanel>
                        <VelkommenInfo />
                    </CounsellorPanel>
                </Box>
            </section>
            <Box margin="xl">
                <VelkommenPageForm onStart={startSoknad} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
