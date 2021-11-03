import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidDagK9FormatInnsending, ArbeidstidK9FormatInnsending } from '../../types/k9FormatInnsending';
import { K9AktivitetArbeidstid, K9Sak } from '../../types/K9Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidstidFormValue, TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToISODateRange } from '../dateUtils';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';
import { timeToISODuration } from '../timeUtils';

export const mapAktivitetArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: TidEnkeltdag,
    arbeidstidSak: K9AktivitetArbeidstid,
    søknadsperioder: DateRange[]
): ArbeidstidDagK9FormatInnsending => {
    const dagerMedEndring: TidEnkeltdag = arbeidstidSak.faktisk
        ? fjernDagerMedUendretTid(faktiskArbeidstid, arbeidstidSak.faktisk)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagK9FormatInnsending = {};
    faktiskArbeid.forEach((dag) => {
        const jobberNormalt = arbeidstidSak.normalt[dag.dato];
        arbeidstidK9Format[ISODateToISODateRange(dag.dato)] = {
            faktiskArbeidTimerPerDag: dag.tid,
            jobberNormaltTimerPerDag: jobberNormalt ? timeToISODuration(jobberNormalt) : undefined,
        };
    });
    return arbeidstidK9Format;
};

export const mapArbeidstidToK9FormatInnsending = (
    arbeidstid: ArbeidstidFormValue,
    k9sak: K9Sak,
    søknadsperioder: DateRange[]
): ArbeidstidK9FormatInnsending => {
    const { arbeidsgiver } = arbeidstid;

    const apiData: ArbeidstidK9FormatInnsending = {
        arbeidstakerList: [],
    };

    Object.keys(arbeidsgiver).forEach((organisasjonsnummer) => {
        const arbeidsgiverSakInfo = k9sak.ytelse.arbeidstid.arbeidsgivereMap[organisasjonsnummer];
        const faktiskArbeidstidFormValues = arbeidsgiver[organisasjonsnummer].faktisk;
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            faktiskArbeidstidFormValues,
            arbeidsgiverSakInfo,
            søknadsperioder
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
    return apiData;
};
