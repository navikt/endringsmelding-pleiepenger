import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { ArbeidstidApiData } from '../../../types/SoknadApiData';
import { K9Arbeidstid } from '../../../types/K9Sak';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import { TidEnkeltdag } from '../../../types/SoknadFormData';

interface Props {
    arbeidstid: ArbeidstidApiData;
    arbeidsgivere: Arbeidsgiver[];
    arbeidstidK9: K9Arbeidstid;
}

const getArbeidsgiverByOrgnr = (orgnr: string, arbeidsgivere: Arbeidsgiver[]): Arbeidsgiver | undefined => {
    return arbeidsgivere.find((a) => a.organisasjonsnummer === orgnr);
};

const ArbeidstidSummary: React.FunctionComponent<Props> = ({ arbeidstid, arbeidsgivere, arbeidstidK9 }) => {
    return (
        <SummarySection header="Arbeidstid">
            {arbeidstid.arbeidsgivere.map(({ faktiskArbeid, orgnr }) => {
                const arbeidsgiver = getArbeidsgiverByOrgnr(orgnr, arbeidsgivere);
                const arbeidstidOpprinnelig: TidEnkeltdag = arbeidstidK9.arbeidsgivereMap[orgnr].faktisk;
                return arbeidsgiver !== undefined ? (
                    <div key={orgnr}>
                        <SummaryBlock header={`${arbeidsgiver.navn} - ${arbeidsgiver.organisasjonsnummer}`}>
                            <TidEnkeltdager dager={faktiskArbeid} dagerOpprinnelig={arbeidstidOpprinnelig} />
                        </SummaryBlock>
                    </div>
                ) : (
                    <span key={orgnr}>{orgnr} - ingen arbeidsgiverinfo</span>
                );
            })}
        </SummarySection>
    );
};

export default ArbeidstidSummary;
