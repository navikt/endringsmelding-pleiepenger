import * as React from 'react';
import { useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { StoppÅrsak } from '../../utils/gatekeeper';

interface Props {
    stoppÅrsak?: StoppÅrsak;
    tittel?: string;
    innhold?: React.ReactNode;
}

const IkkeTilgangPage = ({ tittel, innhold }: Props) => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.ikkeTilgang);
    return (
        <Page
            className="ikkeTilgangPage"
            title={tittel || intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxl">
                <CounsellorPanel type="plakat">
                    {innhold || (
                        <Box margin="l">
                            <p>
                                Vi ser at du har en eller flere saker som vi ikke enda støtter å sende endringsmelding.
                            </p>
                            <p>
                                Benytt <Lenke href={getLenker(intl.defaultLocale).skrivTilOss}>Skriv til oss</Lenke>{' '}
                                eller ta kontakt på telefon, så hjelper vi deg med endringene du ønsker å utføre.
                            </p>
                        </Box>
                    )}
                </CounsellorPanel>
            </Box>
        </Page>
    );
};

export default IkkeTilgangPage;
