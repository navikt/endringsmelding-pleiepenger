import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidDagK9FormatInnsending, ArbeidstidK9FormatInnsending } from '../../types/k9FormatInnsending';
import { K9ArbeidsgiverArbeidstid, K9Sak } from '../../types/K9Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidstidFormValue, TidEnkeltdag } from '../../types/SoknadFormData';
import { ISODateToISODateRange } from '../dateUtils';
import { getTidEnkeltdagApiDataIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';
import { timeToISODuration } from '../timeUtils';

export const mapArbeidsgiverArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: TidEnkeltdag,
    arbeidsgiverSakInfo: K9ArbeidsgiverArbeidstid,
    søknadsperioder: DateRange[]
): ArbeidstidDagK9FormatInnsending => {
    const dagerMedEndring: TidEnkeltdag = arbeidsgiverSakInfo.faktisk
        ? fjernDagerMedUendretTid(faktiskArbeidstid, arbeidsgiverSakInfo.faktisk)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getTidEnkeltdagApiDataIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagK9FormatInnsending = {};
    faktiskArbeid.forEach((dag) => {
        arbeidstidK9Format[ISODateToISODateRange(dag.dato)] = {
            faktiskArbeidTimerPerDag: dag.tid,
            jobberNormaltTimerPerDag: timeToISODuration(arbeidsgiverSakInfo.normalt[dag.dato]),
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

        const perioder = mapArbeidsgiverArbeidstidToK9FormatInnsending(
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
    return apiData;
};
