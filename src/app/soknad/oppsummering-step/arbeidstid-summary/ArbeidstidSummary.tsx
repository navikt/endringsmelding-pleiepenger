import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { K9Arbeidstid } from '../../../types/K9Sak';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { TidEnkeltdagApiData } from '../../../types/SoknadApiData';
import { ArbeidstidK9FormatInnsending } from '../../../types/k9FormatInnsending';

interface Props {
    arbeidsgivere: Arbeidsgiver[];
    arbeidstid: ArbeidstidK9FormatInnsending;
    arbeidstidK9: K9Arbeidstid;
}

const getArbeidsgiverByOrgnr = (orgnr: string, arbeidsgivere: Arbeidsgiver[]): Arbeidsgiver | undefined => {
    return arbeidsgivere.find((a) => a.organisasjonsnummer === orgnr);
};

const ArbeidstidSummary: React.FunctionComponent<Props> = ({ arbeidstid, arbeidsgivere, arbeidstidK9 }) => {
    return (
        <SummarySection header="Arbeidstid">
            {arbeidstid.arbeidstakerList.map(({ arbeidstidInfo: { perioder }, organisasjonsnummer: orgnr }) => {
                const arbeidsgiver = getArbeidsgiverByOrgnr(orgnr, arbeidsgivere);
                const arbeidstidOpprinnelig: TidEnkeltdag = arbeidstidK9.arbeidsgivereMap[orgnr].faktisk;
                const dagerMedTid: TidEnkeltdagApiData[] = [];

                Object.keys(perioder).forEach((key) => {
                    const { faktiskArbeidTimerPerDag } = perioder[key];
                    if (faktiskArbeidTimerPerDag) {
                        dagerMedTid.push({
                            dato: key,
                            tid: faktiskArbeidTimerPerDag,
                        });
                    }
                });

                return arbeidsgiver !== undefined ? (
                    <div key={orgnr}>
                        <SummaryBlock header={`${arbeidsgiver.navn} - ${arbeidsgiver.organisasjonsnummer}`}>
                            <TidEnkeltdager dager={dagerMedTid} dagerOpprinnelig={arbeidstidOpprinnelig} />
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
