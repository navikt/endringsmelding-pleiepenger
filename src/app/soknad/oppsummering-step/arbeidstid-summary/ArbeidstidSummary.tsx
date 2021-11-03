import React from 'react';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import { ArbeidstidDagK9FormatInnsending, ArbeidstidK9FormatInnsending } from '../../../types/k9FormatInnsending';
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
    const renderAktivitetArbeidstid = (
        arbeidstid: ArbeidstidDagK9FormatInnsending,
        arbeidstidOpprinnelig: TidEnkeltdag,
        tittel: string
    ): JSX.Element => {
        const dagerMedTid: TidEnkeltdagApiData[] = [];
        Object.keys(arbeidstid).forEach((key) => {
            const { faktiskArbeidTimerPerDag } = arbeidstid[key];
            if (faktiskArbeidTimerPerDag) {
                dagerMedTid.push({
                    dato: ISODateRangeToISODates(key).from,
                    tid: faktiskArbeidTimerPerDag,
                });
            }
        });
        return (
            <Box padBottom="s" margin="none">
                <SummaryBlock header={tittel}>
                    <TidEnkeltdager dager={dagerMedTid} dagerOpprinnelig={arbeidstidOpprinnelig} />
                </SummaryBlock>
            </Box>
        );
    };

    return (
        <SummarySection header="Endret arbeidstid">
            {arbeidsgivere.map(({ navn, organisasjonsnummer }) => {
                const arbeidsgiverArbeidstid = arbeidstid.arbeidstakerList.find(
                    (a) => a.organisasjonsnummer === organisasjonsnummer
                );
                if (arbeidsgiverArbeidstid) {
                    return renderAktivitetArbeidstid(
                        arbeidsgiverArbeidstid.arbeidstidInfo.perioder,
                        arbeidstidK9.arbeidsgivereMap[organisasjonsnummer].faktisk,
                        `${navn} - ${organisasjonsnummer}`
                    );
                }
                return null;
            })}
            {arbeidstid.frilanserArbeidstidInfo &&
                arbeidstidK9.frilanser &&
                renderAktivitetArbeidstid(
                    arbeidstid.frilanserArbeidstidInfo.perioder,
                    arbeidstidK9.frilanser.faktisk,
                    `Frilanser`
                )}
            {arbeidstid.selvstendigNæringsdrivendeArbeidstidInfo &&
                arbeidstidK9.selvstendig &&
                renderAktivitetArbeidstid(
                    arbeidstid.selvstendigNæringsdrivendeArbeidstidInfo.perioder,
                    arbeidstidK9.selvstendig.faktisk,
                    `Selvstendig næringsdrivende`
                )}
        </SummarySection>
    );
};

export default ArbeidstidSummary;
