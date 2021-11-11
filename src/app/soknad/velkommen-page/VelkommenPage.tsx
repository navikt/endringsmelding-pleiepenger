import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
// import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { useSoknadContext } from '../SoknadContext';
import VelkommenInfo from './VelkommenInfo';
import VelkommenPageForm from './VelkommenPageForm';
import { Sidetittel } from 'nav-frontend-typografi';

interface Props {
    nyeArbeidsforhold: Arbeidsgiver[];
}

const VelkommenPage: React.FunctionComponent<Props> = ({ nyeArbeidsforhold }) => {
    const intl = useIntl();
    const { startSoknad } = useSoknadContext();
    useLogSidevisning('velkommen');
    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            // topContentRenderer={() => <StepBanner tag="h1" text="Melding om endring - pleiepenger for sykt barn" />}
        >
            <Box margin="xl" textAlignCenter={true}>
                <Sidetittel>Endre dine pleiepenger</Sidetittel>
            </Box>
            <section role="contentinfo" aria-label="Introduksjon">
                <Box margin="xl" textAlignCenter={true}>
                    <CounsellorPanel>
                        <VelkommenInfo />
                    </CounsellorPanel>
                </Box>
            </section>
            <Box margin="xl">
                <VelkommenPageForm onStart={startSoknad} nyeArbeidsforhold={nyeArbeidsforhold} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
