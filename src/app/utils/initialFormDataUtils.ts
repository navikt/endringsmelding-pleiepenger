import { isStorageDataValid } from '../soknad/soknadTempStorage';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9AktivitetArbeidstid, K9Arbeidstid, K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import {
    ArbeidstidAktivitetEnkeltdag,
    ArbeidstidArbeidsgiverMap,
    SoknadFormData,
    SoknadFormField,
} from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

/** TODO - skrive tester på disse */

export const getAktivitetArbeidstid = (arbeidstid: K9AktivitetArbeidstid): ArbeidstidAktivitetEnkeltdag => {
    return {
        faktisk: { ...arbeidstid.faktisk },
        normalt: { ...arbeidstid.normalt },
    };
};

export const getArbeidsgivereArbeidstid = (k9Arbeidstid: K9Arbeidstid): ArbeidstidArbeidsgiverMap => {
    const { arbeidsgivereMap } = k9Arbeidstid;
    if (arbeidsgivereMap === undefined) {
        return {};
    }
    const arbeidstidArbeidsgiver: ArbeidstidArbeidsgiverMap = {};
    Object.keys(arbeidsgivereMap).forEach((orgnr) => {
        return getAktivitetArbeidstid(arbeidsgivereMap[orgnr]);
    });
    return arbeidstidArbeidsgiver;
};

export const getInitialFormData = (
    k9sak: K9Sak,
    søker: Person,
    arbeidsgivere: Arbeidsgiver[],
    tempStorage: SoknadTempStorageData
): Partial<SoknadFormData> => {
    const initialData: Partial<SoknadFormData> = {
        [SoknadFormField.harForståttRettigheterOgPlikter]: false,
        [SoknadFormField.harBekreftetOpplysninger]: false,
        omsorgstilbud: k9sak.ytelse.tilsynsordning,
        arbeidstid: {
            arbeidsgiver: getArbeidsgivereArbeidstid(k9sak.ytelse.arbeidstid),
            frilanser: k9sak.ytelse.arbeidstid.frilanser
                ? getAktivitetArbeidstid(k9sak.ytelse.arbeidstid.frilanser)
                : undefined,
            selvstendig: k9sak.ytelse.arbeidstid.selvstendig
                ? getAktivitetArbeidstid(k9sak.ytelse.arbeidstid.selvstendig)
                : undefined,
        },
        ...(isStorageDataValid(tempStorage, { søker, arbeidsgivere, k9søknadsperioder: k9sak.ytelse.søknadsperioder })
            ? tempStorage.formData
            : {}),
    };
    return initialData;
};
