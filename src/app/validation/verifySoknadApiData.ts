import {
    ArbeidstakerK9FormatInnsending,
    ArbeidstidDagK9FormatInnsending,
    ArbeidstidK9FormatInnsending,
} from '../types/k9FormatInnsending';
import { K9ArbeidstakerMap, K9Arbeidstid, K9Sak } from '../types/K9Sak';
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

export const erNormalarbeidstidEndretForPerioder = (
    apiPerioder: ArbeidstidDagK9FormatInnsending,
    k9normaltid: TidEnkeltdag
): boolean => {
    const harDagerSomHarUlikeNormalarbeidstid = Object.keys(apiPerioder).some((isoPeriode) => {
        const { from } = ISODateRangeToISODates(isoPeriode);
        const apiNormaltid = apiPerioder[isoPeriode];
        const k9IsoNormaltid = timeToISODuration(k9normaltid[from]);
        return apiNormaltid === undefined || apiNormaltid.jobberNormaltTimerPerDag !== k9IsoNormaltid;
    });
    return harDagerSomHarUlikeNormalarbeidstid;
};

export const erNormalarbeidstidEndretForArbeidstaker = (
    arbeidstakerList: ArbeidstakerK9FormatInnsending[],
    arbeidstakerMap?: K9ArbeidstakerMap
): boolean => {
    if (arbeidstakerMap === undefined) {
        return true;
    }
    return arbeidstakerList.some((arbeidsgiver) => {
        return erNormalarbeidstidEndretForPerioder(
            arbeidsgiver.arbeidstidInfo.perioder,
            arbeidstakerMap[arbeidsgiver.organisasjonsnummer].normalt
        );
    });
};

export const erNormalarbeidstidEndret = (
    arbeidstidApiValues: ArbeidstidK9FormatInnsending,
    { arbeidstakerMap, frilanser, selvstendig }: K9Arbeidstid
): boolean => {
    const { arbeidstakerList, frilanserArbeidstidInfo, selvstendigNæringsdrivendeArbeidstidInfo } = arbeidstidApiValues;

    const harEndretNormalarbeidstidArbeidstaker =
        erNormalarbeidstidEndretForArbeidstaker(arbeidstakerList, arbeidstakerMap) === true;

    const harEndretNormalarbeidstidFrilanser =
        frilanserArbeidstidInfo !== undefined &&
        frilanser !== undefined &&
        erNormalarbeidstidEndretForPerioder(frilanserArbeidstidInfo.perioder, frilanser.faktisk) === true;

    const harEndretNormalarbeidstidSelvstendig =
        selvstendigNæringsdrivendeArbeidstidInfo !== undefined &&
        selvstendig !== undefined &&
        erNormalarbeidstidEndretForPerioder(selvstendigNæringsdrivendeArbeidstidInfo.perioder, selvstendig.faktisk) ===
            true;

    return (
        harEndretNormalarbeidstidArbeidstaker ||
        harEndretNormalarbeidstidFrilanser ||
        harEndretNormalarbeidstidSelvstendig
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
        if (erNormalarbeidstidEndret(apiData.ytelse.arbeidstid, k9sak.ytelse.arbeidstid)) {
            errors.push(SoknadApiDataField.arbeidstid);
        }
    }
    return { isValid: errors.length === 0, errors };
};
