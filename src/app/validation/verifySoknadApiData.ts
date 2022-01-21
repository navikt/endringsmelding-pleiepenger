import { DateDurationMap, durationToISODuration, ISODateRangeToISODates } from '@navikt/sif-common-utils';
import { ArbeidstakerApiData, ArbeidstidDagKApiData, ArbeidstidApiData } from '../types/YtelseApiData';
import { ArbeidstakerMap, YtelseArbeidstid, Sak } from '../types/Sak';
import { SoknadApiData, SoknadApiDataField } from '../types/SoknadApiData';

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
    apiPerioder: ArbeidstidDagKApiData,
    k9normaltid: DateDurationMap
): boolean => {
    const harDagerSomHarUlikeNormalarbeidstid = Object.keys(apiPerioder).some((isoPeriode) => {
        const { from } = ISODateRangeToISODates(isoPeriode);
        const apiNormaltid = apiPerioder[isoPeriode];
        const k9IsoNormaltid = durationToISODuration(k9normaltid[from]);
        return apiNormaltid === undefined || apiNormaltid.jobberNormaltTimerPerDag !== k9IsoNormaltid;
    });
    return harDagerSomHarUlikeNormalarbeidstid;
};

export const erNormalarbeidstidEndretForArbeidstaker = (
    arbeidstakerList: ArbeidstakerApiData[],
    arbeidstakerMap?: ArbeidstakerMap
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
    arbeidstidApiValues: ArbeidstidApiData,
    { arbeidstakerMap, frilanser, selvstendig }: YtelseArbeidstid
): boolean => {
    const { arbeidstakerList, frilanserArbeidstidInfo, selvstendigNæringsdrivendeArbeidstidInfo } = arbeidstidApiValues;

    const harEndretNormalarbeidstidArbeidstaker =
        erNormalarbeidstidEndretForArbeidstaker(arbeidstakerList, arbeidstakerMap) === true;

    const harEndretNormalarbeidstidFrilanser =
        frilanserArbeidstidInfo !== undefined &&
        frilanser !== undefined &&
        erNormalarbeidstidEndretForPerioder(frilanserArbeidstidInfo.perioder, frilanser.normalt) === true;

    const harEndretNormalarbeidstidSelvstendig =
        selvstendigNæringsdrivendeArbeidstidInfo !== undefined &&
        selvstendig !== undefined &&
        erNormalarbeidstidEndretForPerioder(selvstendigNæringsdrivendeArbeidstidInfo.perioder, selvstendig.normalt) ===
            true;

    return (
        harEndretNormalarbeidstidArbeidstaker ||
        harEndretNormalarbeidstidFrilanser ||
        harEndretNormalarbeidstidSelvstendig
    );
};

export const verifySoknadApiData = (
    apiData: SoknadApiData | undefined,
    sak: Sak
): { isValid: boolean; errors: string[] } => {
    if (apiData === undefined) {
        return {
            isValid: false,
            errors: ['apiValues is undefined'],
        };
    }
    const errors = runVerification(Object.keys(SoknadApiDataField), apiData);
    if (apiData.ytelse.arbeidstid) {
        if (erNormalarbeidstidEndret(apiData.ytelse.arbeidstid, sak.ytelse.arbeidstid)) {
            errors.push(SoknadApiDataField.arbeidstid);
        }
    }
    return { isValid: errors.length === 0, errors };
};
