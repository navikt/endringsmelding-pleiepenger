import { ArbeidsgiverK9FormatInnsending, ArbeidstidDagK9FormatInnsending } from '../types/k9FormatInnsending';
import { K9ArbeidsgivereArbeidstidMap, K9Sak } from '../types/K9Sak';
import { SoknadApiData, SoknadApiDataField } from '../types/SoknadApiData';
import { TidEnkeltdag } from '../types/SoknadFormData';
import { ISODateRangeToISODates } from '../utils/dateUtils';
import { timeToISODuration } from '../utils/timeUtils';

type ApiDataVerification<ApiData> = (values: ApiData) => boolean;

interface SoknadApiVerification<ApiData> {
    [key: string]: ApiDataVerification<ApiData>;
}

export const SoknadApiFellesVerification: SoknadApiVerification<SoknadApiData> = {
    [SoknadApiDataField.id]: ({ id }) => id !== undefined,
    [SoknadApiDataField.harForståttRettigheterOgPlikter]: ({ harForståttRettigheterOgPlikter }) =>
        harForståttRettigheterOgPlikter === true,
};

const runVerification = (keys: string[], values: SoknadApiData): SoknadApiDataField[] => {
    const errors: SoknadApiDataField[] = [];
    keys.forEach((key: SoknadApiDataField) => {
        const func = SoknadApiFellesVerification[key];
        if (func && func(values) === false) {
            errors.push(key);
        }
    });
    return errors;
};

export const normalarbeidstidErUendretForArbeidsgiver = (
    apiPerioder: ArbeidstidDagK9FormatInnsending,
    k9normaltid: TidEnkeltdag
): boolean => {
    const harDagerSomHarUlikeNormalarbeidstid = Object.keys(apiPerioder).some((isoPeriode) => {
        const { from } = ISODateRangeToISODates(isoPeriode);
        const apiNormaltid = apiPerioder[isoPeriode];
        const k9IsoNormaltid = timeToISODuration(k9normaltid[from]);
        return apiNormaltid === undefined || apiNormaltid.jobberNormaltTimerPerDag !== k9IsoNormaltid;
    });
    return harDagerSomHarUlikeNormalarbeidstid === false;
};
export const normalarbeidstidErUendret = (
    apiArbeidsgiverArbeidstid: ArbeidsgiverK9FormatInnsending[],
    k9ArbeidsgiverArbeidstid: K9ArbeidsgivereArbeidstidMap
): boolean => {
    const harArbeidsgivereMedEndretNormalarbeidstid = apiArbeidsgiverArbeidstid.some((arbeidsgiver) => {
        return (
            normalarbeidstidErUendretForArbeidsgiver(
                arbeidsgiver.arbeidstidInfo.perioder,
                k9ArbeidsgiverArbeidstid[arbeidsgiver.organisasjonsnummer].normalt
            ) === false
        );
    });
    return harArbeidsgivereMedEndretNormalarbeidstid === false;
};

export const verifySoknadApiData = (
    apiData: SoknadApiData | undefined,
    k9sak: K9Sak
): { isValid: boolean; errors: string[] } => {
    if (apiData === undefined) {
        return {
            isValid: false,
            errors: ['apiValues is undefined'],
        };
    }
    const errors = runVerification(Object.keys(SoknadApiDataField), apiData);
    if (apiData.ytelse.arbeidstid) {
        if (
            normalarbeidstidErUendret(
                apiData.ytelse.arbeidstid.arbeidstakerList,
                k9sak.ytelse.arbeidstid.arbeidsgivereMap
            ) === false
        ) {
            errors.push(SoknadApiDataField.arbeidstid);
        }
    }
    return { isValid: errors.length === 0, errors };
};
