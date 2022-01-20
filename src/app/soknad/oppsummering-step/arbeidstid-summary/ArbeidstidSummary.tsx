import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { DateDurationMap, ISODateRangeToISODates } from '@navikt/sif-common-utils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import SummaryDagerMedTid from '../../../components/summary-dager-med-tid/SummaryDagerMedTid';
import { Arbeidsgiver } from '../../../types/Arbeidsgiver';
import { ArbeidstidDagKApiData, ArbeidstidApiData } from '../../../types/YtelseApiData';
import { YtelseArbeidstid } from '../../../types/Sak';
import { TidEnkeltdagApiData } from '../../../types/SoknadApiData';

// TODO - legge på tekst dersom bruker har sagt en vil endre arbeidstid men ikke har gjort det.

interface Props {
    arbeidsgivere: Arbeidsgiver[];
    arbeidstid: ArbeidstidApiData;
    arbeidstidK9: YtelseArbeidstid;
}

const ArbeidstidSummary: React.FunctionComponent<Props> = ({ arbeidstid, arbeidsgivere, arbeidstidK9 }) => {
    const renderAktivitetArbeidstid = (
        arbeidstid: ArbeidstidDagKApiData,
        arbeidstidOpprinnelig: DateDurationMap,
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
            <Box padBottom="s" margin="none" key={tittel}>
                <FormBlock>
                    <Element tag="h3">{tittel}</Element>
                    <SummaryDagerMedTid dager={dagerMedTid} dagerOpprinnelig={arbeidstidOpprinnelig} />
                </FormBlock>
            </Box>
        );
    };

    return (
        <SummarySection header="Endret arbeidstid">
            {arbeidsgivere.map(({ navn, id: ident }) => {
                const arbeidsgiverArbeidstid = arbeidstid.arbeidstakerList.find((a) => a.organisasjonsnummer === ident);
                if (arbeidsgiverArbeidstid && arbeidstidK9.arbeidstakerMap) {
                    return renderAktivitetArbeidstid(
                        arbeidsgiverArbeidstid.arbeidstidInfo.perioder,
                        arbeidstidK9.arbeidstakerMap[ident].faktisk,
                        `${navn} - ${ident}`
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
