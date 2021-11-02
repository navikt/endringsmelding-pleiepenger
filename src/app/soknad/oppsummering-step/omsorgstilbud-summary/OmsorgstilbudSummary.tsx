import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { TilsynsordningK9FormatInnsending } from '../../../types/k9FormatInnsending';
import { TidEnkeltdagApiData } from '../../../types/SoknadApiData';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { ISODateRangeToISODates } from '../../../utils/dateUtils';

interface Props {
    tilsynsordning: TilsynsordningK9FormatInnsending;
    tidIOmsorgstilbudSak?: TidEnkeltdag;
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
                <TidEnkeltdager
                    dager={dagerMedTid}
                    dagerOpprinnelig={tidIOmsorgstilbudSak}
                    ingenEndringerMelding={'Ingen endringer registrert på omsorgstilbud'}
                />
            </SummaryBlock>
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
