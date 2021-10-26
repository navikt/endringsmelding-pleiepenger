import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { ArbeidstidApiData } from '../../../types/SoknadApiData';
import { K9Arbeidstid } from '../../../types/K9Sak';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';

interface Props {
    arbeidstid: ArbeidstidApiData;
    arbeidsgivere: Arbeidsgiver[];
    arbeidstidK9: K9Arbeidstid;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArbeidstidSummary: React.FunctionComponent<Props> = ({ arbeidstid, arbeidsgivere, arbeidstidK9 }) => {
    return (
        <SummarySection header="Arbeidstid">
            {arbeidsgivere?.map((arbeidsgiver) => {
                // const arbeidstidArbeidsgiver = arbeidstid.arbeidsgiver[arbeidsgiver.organisasjonsnummer];
                return (
                    <div key={arbeidsgiver.organisasjonsnummer}>
                        <SummaryBlock header={`${arbeidsgiver.navn} - ${arbeidsgiver.organisasjonsnummer}`}>
                            <TidEnkeltdager dager={[]} />
                        </SummaryBlock>
                    </div>
                );
            })}
        </SummarySection>
    );
};

export default ArbeidstidSummary;
