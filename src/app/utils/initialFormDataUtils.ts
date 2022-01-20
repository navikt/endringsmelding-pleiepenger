import { isStorageDataValid } from '../soknad/soknadTempStorage';
import { YtelseArbeidstid, ArbeidstidEnkeltdagSak, Sak } from '../types/Sak';
import { Søker } from '../types/Søker';
import {
    ArbeidstidEnkeltdagSøknad,
    ArbeidstidArbeidsgiverMap,
    SoknadFormData,
    SoknadFormField,
} from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

/** TODO - skrive tester på disse */

export const getArbeidstidEnkeltdagFormValueFraK9ArbeidstidSak = (
    arbeidstid: ArbeidstidEnkeltdagSak
): ArbeidstidEnkeltdagSøknad => {
    return {
        faktisk: { ...arbeidstid.faktisk },
        normalt: { ...arbeidstid.normalt },
    };
};

export const getArbeidstidArbeidsgiverMap = (k9Arbeidstid: YtelseArbeidstid): ArbeidstidArbeidsgiverMap => {
    const { arbeidstakerMap } = k9Arbeidstid;
    if (arbeidstakerMap === undefined) {
        return {};
    }
    const arbeidstidArbeidsgiver: ArbeidstidArbeidsgiverMap = {};
    Object.keys(arbeidstakerMap).forEach((orgnr) => {
        arbeidstidArbeidsgiver[orgnr] = getArbeidstidEnkeltdagFormValueFraK9ArbeidstidSak(arbeidstakerMap[orgnr]);
    });
    return arbeidstidArbeidsgiver;
};

export const getInitialFormData = (
    sak: Sak,
    søker: Søker,
    tempStorage: SoknadTempStorageData
): Partial<SoknadFormData> => {
    const initialData: Partial<SoknadFormData> = {
        [SoknadFormField.harForståttRettigheterOgPlikter]: false,
        [SoknadFormField.harBekreftetOpplysninger]: false,
        [SoknadFormField.sakBarnAktørid]: sak.barn.aktørId,
        hvaSkalEndres: [],
        omsorgstilbud: { ...sak.ytelse.tilsynsordning },
        arbeidstid: {
            arbeidsgiver: getArbeidstidArbeidsgiverMap(sak.ytelse.arbeidstid),
            frilanser: sak.ytelse.arbeidstid.frilanser
                ? getArbeidstidEnkeltdagFormValueFraK9ArbeidstidSak(sak.ytelse.arbeidstid.frilanser)
                : undefined,
            selvstendig: sak.ytelse.arbeidstid.selvstendig
                ? getArbeidstidEnkeltdagFormValueFraK9ArbeidstidSak(sak.ytelse.arbeidstid.selvstendig)
                : undefined,
        },
        ...(isStorageDataValid(tempStorage, { søker, sak }) ? tempStorage.formData : {}),
    };
    return initialData;
};
