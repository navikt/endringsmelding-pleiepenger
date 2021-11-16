import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidDagK9FormatInnsending, ArbeidstidK9FormatInnsending } from '../../types/k9FormatInnsending';
import { K9ArbeidstidInfo, K9Sak } from '../../types/K9Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import {
    ArbeidssituasjonFormValue,
    Arbeidssituasjon,
    ArbeidstidFormValue,
    TidEnkeltdag,
} from '../../types/SoknadFormData';
import { getArbeidssituasjonForArbeidsgiver } from '../arbeidssituasjonUtils';
import { beregNormalarbeidstid } from '../beregnNormalarbeidstidUtils';
import { ISODateToISODateRange } from '../dateUtils';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';
import { timeToISODuration } from '../timeUtils';

export const mapAktivitetArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: TidEnkeltdag,
    arbeidstidSak: K9ArbeidstidInfo | undefined,
    søknadsperioder: DateRange[],
    arbeidssituasjon?: Arbeidssituasjon
): ArbeidstidDagK9FormatInnsending => {
    const dagerMedEndring: TidEnkeltdag = arbeidstidSak?.faktisk
        ? fjernDagerMedUendretTid(faktiskArbeidstid, arbeidstidSak.faktisk)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagK9FormatInnsending = {};
    const nyNormalarbeidstid = arbeidssituasjon
        ? beregNormalarbeidstid(arbeidssituasjon.jobberNormaltTimer)
        : undefined;

    faktiskArbeid.forEach((dag) => {
        const jobberNormalt = arbeidstidSak?.normalt[dag.dato] || nyNormalarbeidstid;
        if (!jobberNormalt) {
            throw new Error('mapAktivitetArbeidstidToK9FormatInnsending - jobberNormalt is undefined ');
        }
        arbeidstidK9Format[ISODateToISODateRange(dag.dato)] = {
            faktiskArbeidTimerPerDag: dag.tid,
            jobberNormaltTimerPerDag: timeToISODuration(jobberNormalt),
        };
    });
    return arbeidstidK9Format;
};

export const mapArbeidstidToK9FormatInnsending = ({
    arbeidstid,
    k9sak,
    søknadsperioder,
    arbeidssituasjon,
}: {
    arbeidstid: ArbeidstidFormValue;
    k9sak: K9Sak;
    søknadsperioder: DateRange[];
    arbeidssituasjon: ArbeidssituasjonFormValue | undefined;
}): ArbeidstidK9FormatInnsending | undefined => {
    const { arbeidsgiver } = arbeidstid;

    const apiData: ArbeidstidK9FormatInnsending = {
        arbeidstakerList: [],
    };

    const { arbeidstakerMap } = k9sak.ytelse.arbeidstid;
    Object.keys(arbeidsgiver).forEach((organisasjonsnummer) => {
        const arbeidsgiverSakInfo = arbeidstakerMap ? arbeidstakerMap[organisasjonsnummer] : undefined;
        const arbeidssituasjonInfo = getArbeidssituasjonForArbeidsgiver(organisasjonsnummer, arbeidssituasjon);
        if (!arbeidssituasjon && !arbeidsgiverSakInfo) {
            throw new Error('Mangler informasjon om arbeidssituasjon');
        }
        const faktiskArbeidstidFormValues = arbeidsgiver[organisasjonsnummer].faktisk;
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            faktiskArbeidstidFormValues,
            arbeidsgiverSakInfo,
            søknadsperioder,
            arbeidssituasjonInfo
        );
        if (Object.keys(perioder).length > 0) {
            apiData.arbeidstakerList.push({
                organisasjonsnummer,
                arbeidstidInfo: {
                    perioder,
                },
            });
        }
    });

    if (arbeidstid.frilanser && k9sak.ytelse.arbeidstid.frilanser) {
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstid.frilanser.faktisk,
            k9sak.ytelse.arbeidstid.frilanser,
            søknadsperioder
        );
        if (Object.keys(perioder).length > 0) {
            apiData.frilanserArbeidstidInfo = {
                perioder,
            };
        }
    }

    if (arbeidstid.selvstendig && k9sak.ytelse.arbeidstid.selvstendig) {
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstid.selvstendig.faktisk,
            k9sak.ytelse.arbeidstid.selvstendig,
            søknadsperioder
        );
        if (Object.keys(perioder).length > 0) {
            apiData.selvstendigNæringsdrivendeArbeidstidInfo = {
                perioder,
            };
        }
    }

    if (
        apiData.arbeidstakerList.length > 0 ||
        apiData.selvstendigNæringsdrivendeArbeidstidInfo?.perioder ||
        apiData.frilanserArbeidstidInfo?.perioder
    ) {
        return apiData;
    }
    return undefined;
};
