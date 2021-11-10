import React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sidetittel } from 'nav-frontend-typografi';
import { useSoknadContext } from '../SoknadContext';
import VelkommenPageForm from './VelkommenPageForm';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import VelkommenInfo from './VelkommenInfo';

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
            topContentRenderer={(): JSX.Element =>
                1 + 1 == 2 ? (
                    <></>
                ) : (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'step.velkommen.banner.tittel'),
                            normalText: intlHelper(intl, 'step.velkommen.banner.tekst'),
                        }}
                    />
                )
            }>
            <Box margin="xl" textAlignCenter={true}>
                <Sidetittel>{intlHelper(intl, 'step.velkommen.tittel')}</Sidetittel>
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
