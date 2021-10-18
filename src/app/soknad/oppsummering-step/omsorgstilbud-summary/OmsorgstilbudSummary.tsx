import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { OmsorgstilbudApiData } from '../../../types/SoknadApiData';

interface Props {
    omsorgstilbud: OmsorgstilbudApiData;
}

const OmsorgstilbudSummary: React.FunctionComponent<Props> = ({ omsorgstilbud }) => {
    return (
        <SummarySection header="Omsorgstilbud">
            {omsorgstilbud && (
                <SummaryBlock header="Endret omsorgstilbud">
                    <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
