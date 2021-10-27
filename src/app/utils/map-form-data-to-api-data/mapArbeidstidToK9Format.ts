import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidDagK9FormatInnsending, ArbeidstidK9FormatInnsending } from '../../types/k9FormatInnsending';
import { K9Sak } from '../../types/K9Sak';
import { TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidstidFormValue, TidEnkeltdag } from '../../types/SoknadFormData';
import { getEnkeltdagerIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';

export const mapArbeidsgiverArbeidstidToK9FormatInnsending = (
    faktiskArbeidstid: TidEnkeltdag,
    opprinneligFaktiskArbeid: TidEnkeltdag | undefined,
    søknadsperioder: DateRange[]
): ArbeidstidDagK9FormatInnsending => {
    const dagerMedEndring: TidEnkeltdag = opprinneligFaktiskArbeid
        ? fjernDagerMedUendretTid(faktiskArbeidstid, opprinneligFaktiskArbeid)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getEnkeltdagerIPeriodeApiData(dagerMedEndring, periode))
    );

    const arbeidstidK9Format: ArbeidstidDagK9FormatInnsending = {};
    faktiskArbeid.forEach((dag) => {
        arbeidstidK9Format[dag.dato] = {
            faktiskArbeidTimerPerDag: dag.tid,
            jobberNormaltTimerPerDag: undefined,
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
        const opprinneligFaktiskArbeid = arbeidsgiverSakInfo ? arbeidsgiverSakInfo.faktisk : undefined;

        const perioder = mapArbeidsgiverArbeidstidToK9FormatInnsending(
            faktiskArbeidstidFormValues,
            opprinneligFaktiskArbeid,
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
