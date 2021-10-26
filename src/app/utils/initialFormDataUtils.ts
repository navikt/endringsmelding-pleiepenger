import { isStorageDataValid } from '../soknad/soknadTempStorage';
import { K9Arbeidstid, K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { ArbeidstidArbeidsgiverMap, SoknadFormData, SoknadFormField } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

/** TODO - skrive tester på disse */

export const getArbeidsgivereArbeidstid = (k9Arbeidstid: K9Arbeidstid): ArbeidstidArbeidsgiverMap => {
    const arbeidstidArbeidsgiver: ArbeidstidArbeidsgiverMap = {};
    Object.keys(k9Arbeidstid.arbeidsgivereMap).forEach((orgnr) => {
        arbeidstidArbeidsgiver[orgnr] = {
            faktisk: { ...k9Arbeidstid.arbeidsgivereMap[orgnr].faktisk },
            normalt: { ...k9Arbeidstid.arbeidsgivereMap[orgnr].normalt },
        };
    });
    return arbeidstidArbeidsgiver;
};

export const getInitialFormData = (
    k9sak: K9Sak,
    søker: Person,
    tempStorage: SoknadTempStorageData
): Partial<SoknadFormData> => {
    const initialData = {
        [SoknadFormField.harForståttRettigheterOgPlikter]: false,
        [SoknadFormField.harBekreftetOpplysninger]: false,
        omsorgstilbud: k9sak.ytelse.tilsynsordning,
        arbeidstid: {
            arbeidsgiver: getArbeidsgivereArbeidstid(k9sak.ytelse.arbeidstid),
        },
        ...(isStorageDataValid(tempStorage, { søker }) ? tempStorage.formData : {}),
    };
    return initialData;
};
