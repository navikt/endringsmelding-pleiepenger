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

export const verifySoknadApiData = (apiData?: SoknadApiData): boolean => {
    if (!apiData) {
        return false;
    }
    const errors = runVerification(Object.keys(SoknadApiDataField), apiData);

    return errors.length === 0;
};
