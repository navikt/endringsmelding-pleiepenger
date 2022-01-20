import { DateRange } from '@navikt/sif-common-formik/lib';
import {
    DateDurationMap,
    durationToISODuration,
    getDateDurationDiff,
    ISODateToISODateRange,
} from '@navikt/sif-common-utils';
import { ArbeidstidDagKApiData, ArbeidstidApiData } from '../../types/YtelseApiData';
import { ArbeidstidEnkeltdagSak, Sak } from '../../types/Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidssituasjonFormValue, ArbeidstidFormValue } from '../../types/SoknadFormData';
// import { getArbeidssituasjonForArbeidsgiver } from '../arbeidUtils';
// import { beregNormalarbeidstid } from '../beregnNormalarbeidstidUtils';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';

export const mapAktivitetArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: DateDurationMap,
    arbeidstidSak: ArbeidstidEnkeltdagSak | undefined,
    søknadsperioder: DateRange[]
    // arbeidssituasjon?: Arbeidssituasjon
): ArbeidstidDagKApiData => {
    const dagerMedEndring: DateDurationMap = arbeidstidSak?.faktisk
        ? getDateDurationDiff(faktiskArbeidstid, arbeidstidSak.faktisk)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagKApiData = {};
    // const nyNormalarbeidstid = arbeidssituasjon
    //     ? beregNormalarbeidstid(arbeidssituasjon.jobberNormaltTimer)
    //     : undefined;

    faktiskArbeid.forEach((dag) => {
        const jobberNormalt = arbeidstidSak?.normalt[dag.dato]; // || nyNormalarbeidstid;
        if (jobberNormalt) {
            // throw new Error(`mapAktivitetArbeidstidToK9FormatInnsending - jobberNormalt is undefined ${dag.dato}`);
            // } else {
            arbeidstidK9Format[ISODateToISODateRange(dag.dato)] = {
                faktiskArbeidTimerPerDag: dag.tid,
                jobberNormaltTimerPerDag: durationToISODuration(jobberNormalt),
            };
        }
    });
    return arbeidstidK9Format;
};

export const mapArbeidstidToK9FormatInnsending = ({
    arbeidstid,
    sak,
    søknadsperioder,
    arbeidssituasjon,
}: {
    arbeidstid: ArbeidstidFormValue;
    sak: Sak;
    søknadsperioder: DateRange[];
    arbeidssituasjon: ArbeidssituasjonFormValue | undefined;
}): ArbeidstidApiData | undefined => {
    const { arbeidsgiver } = arbeidstid;

    const apiData: ArbeidstidApiData = {
        arbeidstakerList: [],
    };

    const { arbeidstakerMap } = sak.ytelse.arbeidstid;
    Object.keys(arbeidsgiver).forEach((organisasjonsnummer) => {
        const arbeidsgiverSakInfo = arbeidstakerMap ? arbeidstakerMap[organisasjonsnummer] : undefined;
        // const arbeidssituasjonInfo = getArbeidssituasjonForArbeidsgiver(organisasjonsnummer, arbeidssituasjon);
        if (!arbeidssituasjon && !arbeidsgiverSakInfo) {
            throw new Error('Mangler informasjon om arbeidssituasjon');
        }
        const faktiskArbeidstidFormValues = arbeidsgiver[organisasjonsnummer].faktisk;
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            faktiskArbeidstidFormValues,
            arbeidsgiverSakInfo,
            søknadsperioder
            // arbeidssituasjonInfo
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

    if (arbeidstid.frilanser && sak.ytelse.arbeidstid.frilanser) {
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstid.frilanser.faktisk,
            sak.ytelse.arbeidstid.frilanser,
            søknadsperioder
        );
        if (Object.keys(perioder).length > 0) {
            apiData.frilanserArbeidstidInfo = {
                perioder,
            };
        }
    }

    if (arbeidstid.selvstendig && sak.ytelse.arbeidstid.selvstendig) {
        const perioder = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstid.selvstendig.faktisk,
            sak.ytelse.arbeidstid.selvstendig,
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
