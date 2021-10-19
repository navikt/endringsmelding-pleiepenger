import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { OmsorgstilbudApiData } from '../../../types/SoknadApiData';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { TidEnkeltdag } from '../../../types/SoknadFormData';

interface Props {
    omsorgstilbud: OmsorgstilbudApiData;
    tidIOmsorgstilbudSak?: TidEnkeltdag;
}

const OmsorgstilbudSummary: React.FunctionComponent<Props> = ({ omsorgstilbud, tidIOmsorgstilbudSak }) => {
    return (
        <SummarySection header="Omsorgstilbud">
            {omsorgstilbud && (
                <SummaryBlock header="Endret omsorgstilbud">
                    <TidEnkeltdager dager={omsorgstilbud.enkeltdager} dagerOpprinnelig={tidIOmsorgstilbudSak} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
