import { ArbeidsgiverK9FormatInnsending } from '../types/k9FormatInnsending';
import { K9ArbeidsgivereArbeidstidMap, K9Sak } from '../types/K9Sak';
import { SoknadApiData, SoknadApiDataField } from '../types/SoknadApiData';
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

const normalarbeidstidErUendret = (
    apiArbeidsgiverArbeidstid: ArbeidsgiverK9FormatInnsending[],
    k9ArbeidsgiverArbeidstid: K9ArbeidsgivereArbeidstidMap
): boolean => {
    return (
        apiArbeidsgiverArbeidstid.some((arbeidsgiver) => {
            const { perioder } = arbeidsgiver.arbeidstidInfo;
            return (
                Object.keys(perioder).some((isoPeriode) => {
                    const { from } = ISODateRangeToISODates(isoPeriode);
                    const apiNormaltid = perioder[isoPeriode];
                    const k9normaltid = timeToISODuration(
                        k9ArbeidsgiverArbeidstid[arbeidsgiver.organisasjonsnummer].normalt[from]
                    );
                    return apiNormaltid && apiNormaltid.jobberNormaltTimerPerDag === k9normaltid;
                }) === false
            );
        }) === false
    );
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
