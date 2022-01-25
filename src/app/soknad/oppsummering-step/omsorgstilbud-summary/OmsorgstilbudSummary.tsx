import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { DateDurationMap, ISODateRangeToISODates } from '@navikt/sif-common-utils';
import SummaryDagerMedTid from '../../../components/summary-dager-med-tid/SummaryDagerMedTid';
import { TidEnkeltdagApiData } from '../../../types/SoknadApiData';
import { TilsynsordningApiData } from '../../../types/YtelseApiData';

interface Props {
    tilsynsordning: TilsynsordningApiData;
    tidIOmsorgstilbudSak?: DateDurationMap;
}

const OmsorgstilbudSummary: React.FunctionComponent<Props> = ({ tilsynsordning, tidIOmsorgstilbudSak }) => {
    const dagerMedTid: TidEnkeltdagApiData[] = [];

    Object.keys(tilsynsordning.perioder).forEach((key) => {
        const { etablertTilsynTimerPerDag } = tilsynsordning.perioder[key];
        if (etablertTilsynTimerPerDag) {
            dagerMedTid.push({
                dato: ISODateRangeToISODates(key).from,
                tid: etablertTilsynTimerPerDag,
            });
        }
    });

    return (
        <SummarySection header="Omsorgstilbud">
            <SummaryBlock header="Endret omsorgstilbud">
                <SummaryDagerMedTid
                    dager={dagerMedTid}
                    dagerOpprinnelig={tidIOmsorgstilbudSak}
                    ingenEndringerMelding={'Ingen endringer registrert på omsorgstilbud'}
                />
            </SummaryBlock>
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
