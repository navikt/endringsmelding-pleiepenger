import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import { ArbeidstidK9FormatInnsending } from '../../../types/k9FormatInnsending';
import { K9Arbeidstid } from '../../../types/K9Sak';
import { TidEnkeltdagApiData } from '../../../types/SoknadApiData';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { ISODateRangeToISODates } from '../../../utils/dateUtils';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    arbeidsgivere: Arbeidsgiver[];
    arbeidstid: ArbeidstidK9FormatInnsending;
    arbeidstidK9: K9Arbeidstid;
}

const ArbeidstidSummary: React.FunctionComponent<Props> = ({ arbeidstid, arbeidsgivere, arbeidstidK9 }) => {
    return (
        <SummarySection header="Arbeidstid">
            {arbeidsgivere.map(({ navn, organisasjonsnummer }) => {
                const arbeidsgiverArbeidstid = arbeidstid.arbeidstakerList.find(
                    (a) => a.organisasjonsnummer === organisasjonsnummer
                );
                if (arbeidsgiverArbeidstid) {
                    const perioder = arbeidsgiverArbeidstid.arbeidstidInfo.perioder;
                    const arbeidstidOpprinnelig: TidEnkeltdag =
                        arbeidstidK9.arbeidsgivereMap[organisasjonsnummer].faktisk;
                    const dagerMedTid: TidEnkeltdagApiData[] = [];

                    Object.keys(perioder).forEach((key) => {
                        const { faktiskArbeidTimerPerDag } = perioder[key];
                        if (faktiskArbeidTimerPerDag) {
                            dagerMedTid.push({
                                dato: ISODateRangeToISODates(key).from,
                                tid: faktiskArbeidTimerPerDag,
                            });
                        }
                    });

                    return (
                        <Box padBottom="s" margin="none" key={organisasjonsnummer}>
                            <SummaryBlock header={`${navn} - ${organisasjonsnummer}`}>
                                <TidEnkeltdager dager={dagerMedTid} dagerOpprinnelig={arbeidstidOpprinnelig} />
                            </SummaryBlock>
                        </Box>
                    );
                }
                return <span key={organisasjonsnummer}>{organisasjonsnummer} - ingen arbeidsgiverinfo</span>;
            })}
        </SummarySection>
    );
};

export default ArbeidstidSummary;
