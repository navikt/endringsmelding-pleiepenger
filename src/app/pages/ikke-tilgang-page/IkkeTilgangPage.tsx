import * as React from 'react';
import { useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StoppÅrsak } from '../../utils/gatekeeper';

interface Props {
    stoppÅrsak?: StoppÅrsak;
    tittel?: string;
    innhold?: React.ReactNode;
}

const IkkeTilgangPage = ({ tittel, innhold, stoppÅrsak }: Props) => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.ikkeTilgang);
    return (
        <Page
            className="ikkeTilgangPage"
            title={tittel || intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxl">
                <CounsellorPanel type="plakat">
                    {innhold || <p>Du kan dessverre ikke bruke denne løsningen enda. For å melde endring, må du abc</p>}
                    {stoppÅrsak && <p>Årsak: {stoppÅrsak}</p>}
                </CounsellorPanel>
            </Box>
        </Page>
    );
};

export default IkkeTilgangPage;
