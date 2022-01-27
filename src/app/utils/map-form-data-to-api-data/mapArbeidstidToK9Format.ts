import {
    DateDurationMap,
    DateRange,
    durationToISODuration,
    getDateDurationDiff,
    ISODateToISODateRange,
} from '@navikt/sif-common-utils';
import { ArbeidstidEnkeltdagSak, Sak } from '../../types/Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidstidFormValue } from '../../types/SoknadFormData';
import { ArbeidstidApiData, ArbeidstidDagKApiData } from '../../types/YtelseApiData';
import appSentryLogger from '../appSentryLogger';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';

export const mapAktivitetArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: DateDurationMap,
    arbeidstidSak: ArbeidstidEnkeltdagSak | undefined,
    søknadsperioder: DateRange[]
): ArbeidstidDagKApiData => {
    const dagerMedEndring: DateDurationMap = arbeidstidSak?.faktisk
        ? getDateDurationDiff(faktiskArbeidstid, arbeidstidSak.faktisk)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagKApiData = {};
    faktiskArbeid.forEach((dag) => {
        const jobberNormalt = arbeidstidSak?.normalt[dag.dato];
        if (jobberNormalt) {
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
}: {
    arbeidstid: ArbeidstidFormValue;
    sak: Sak;
    søknadsperioder: DateRange[];
}): ArbeidstidApiData | undefined => {
    const { arbeidsgiver } = arbeidstid;

    const apiData: ArbeidstidApiData = {
        arbeidstakerList: [],
    };

    const { arbeidstakerMap } = sak.ytelse.arbeidstid;
    Object.keys(arbeidsgiver).forEach((organisasjonsnummer) => {
        const arbeidsgiverSakInfo = arbeidstakerMap ? arbeidstakerMap[organisasjonsnummer] : undefined;
        if (!arbeidsgiverSakInfo) {
            appSentryLogger.logError('mapArbeidstidToK9FormatInnsending', 'Mangler arbeidsgiverSakInfo');
            throw new Error('Mangler informasjon om arbeidsgiverSak');
        }
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
