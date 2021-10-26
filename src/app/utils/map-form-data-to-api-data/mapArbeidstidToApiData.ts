import { DateRange } from '@navikt/sif-common-formik/lib';
import { K9Sak } from '../../types/K9Sak';
import { ArbeidstidApiData, TidEnkeltdagApiData } from '../../types/SoknadApiData';
import { ArbeidstidFormValue, TidEnkeltdag } from '../../types/SoknadFormData';
import { getEnkeltdagerIPeriodeApiData } from '../tidsbrukApiUtils';
import { fjernDagerMedUendretTid } from '../tidsbrukUtils';

export const mapArbeidsgiverArbeidstidToApiData = (
    faktiskArbeidstid: TidEnkeltdag,
    opprinneligFaktiskArbeid: TidEnkeltdag | undefined,
    søknadsperioder: DateRange[]
): TidEnkeltdagApiData[] => {
    const dagerMedEndring: TidEnkeltdag = opprinneligFaktiskArbeid
        ? fjernDagerMedUendretTid(faktiskArbeidstid, opprinneligFaktiskArbeid)
        : faktiskArbeidstid;

    const faktiskArbeid: TidEnkeltdagApiData[] = [];
    søknadsperioder.forEach((periode) =>
        faktiskArbeid.push(...getEnkeltdagerIPeriodeApiData(dagerMedEndring, periode))
    );
    return faktiskArbeid;
};

export const mapArbeidstidToApiData = (
    arbeidstid: ArbeidstidFormValue,
    k9sak: K9Sak,
    søknadsperioder: DateRange[]
): ArbeidstidApiData => {
    const { arbeidsgiver } = arbeidstid;

    const apiData: ArbeidstidApiData = {
        arbeidsgivere: [],
    };

    Object.keys(arbeidsgiver).forEach((orgnr) => {
        const arbeidsgiverSakInfo = k9sak.ytelse.arbeidstid.arbeidsgivereMap[orgnr];
        const faktiskArbeidstid = arbeidsgiver[orgnr].faktisk;
        const opprinneligFaktiskArbeid = arbeidsgiverSakInfo ? arbeidsgiverSakInfo.faktisk : undefined;

        const faktiskArbeid = mapArbeidsgiverArbeidstidToApiData(
            faktiskArbeidstid,
            opprinneligFaktiskArbeid,
            søknadsperioder
        );
        if (faktiskArbeid.length > 0) {
            apiData.arbeidsgivere.push({
                orgnr,
                faktiskArbeid,
            });
        }
    });
    return apiData;
};
