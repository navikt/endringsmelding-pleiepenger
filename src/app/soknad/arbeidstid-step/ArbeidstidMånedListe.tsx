import React from 'react';
import { ArbeidsforholdType, SøknadsperioderMånedListe } from '@navikt/sif-common-pleiepenger/lib';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import {
    DateDurationMap,
    DateRange,
    getDatesInDateRange,
    getDurationsInDateRange,
    getYearMonthKey,
    isDateInDates,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { ArbeidstidEnkeltdagSak, SakMetadata } from '../../types/Sak';
import { ArbeidstidEnkeltdagSøknad, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import ArbeidstidMåned from './ArbeidstidMåned';
import { getDatesNotInDates } from '../../utils/arbeidUtils';

interface Props {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SoknadFormField;
    arbeidstidEnkeltdagSøknad: ArbeidstidEnkeltdagSøknad;
    arbeidstidEnkeltdagSak: ArbeidstidEnkeltdagSak;
    sakMetadata: SakMetadata;
    onArbeidstidChanged?: (arbeidstid: DateDurationMap) => void;
}

const getDatoerSomIkkeErTilgjengeligIMåned = (
    måned: DateRange,
    sakMetadata: SakMetadata,
    dagerSak: DateDurationMap
): Date[] => {
    const dagerIkkeSøktForIMåned = sakMetadata.datoerIkkeSøktForIMåned[getYearMonthKey(måned.from)];
    const datoerIMåned = getDatesInDateRange(måned);
    const datoerISak = Object.keys(dagerSak).map((d) => ISODateToDate(d));
    return [...dagerIkkeSøktForIMåned, ...getDatesNotInDates(datoerIMåned, datoerISak)];
};

const ArbeidstidMånedListe: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    arbeidsforholdType,
    formFieldName,
    arbeidstidEnkeltdagSak: arbeidstidSak,
    arbeidstidEnkeltdagSøknad,
    sakMetadata,
    onArbeidstidChanged,
}) => {
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const månedContentRenderer = (måned: DateRange) => {
        const dagerSøknad = getDurationsInDateRange(arbeidstidEnkeltdagSøknad.faktisk, måned);
        const dagerSak = getDurationsInDateRange(arbeidstidSak.faktisk, måned);
        const datoerSomIkkeErTilgjengelig = getDatoerSomIkkeErTilgjengeligIMåned(måned, sakMetadata, dagerSak);

        const handleOnEnkeltdagChange = ({ dagerMedTid }: TidEnkeltdagEndring) => {
            const newValues: DateDurationMap = { ...arbeidstidEnkeltdagSøknad.faktisk };
            Object.keys(dagerMedTid).forEach((key) => {
                const dagErTilgjengelig = isDateInDates(ISODateToDate(key), datoerSomIkkeErTilgjengelig) === false;
                if (dagErTilgjengelig) {
                    newValues[key] = dagerMedTid[key];
                }
            });
            setFieldValue(formFieldName as any, newValues);
            onArbeidstidChanged ? onArbeidstidChanged(newValues) : undefined;
        };

        return (
            <ArbeidstidMåned
                arbeidsstedNavn={arbeidsstedNavn}
                måned={måned}
                dagerSak={dagerSak}
                dagerSøknad={dagerSøknad}
                endringsperiode={sakMetadata.endringsperiode}
                utilgjengeligeDatoer={datoerSomIkkeErTilgjengelig}
                månedTittelHeadingLevel={sakMetadata.søknadsperioderGårOverFlereÅr ? 4 : 3}
                arbeidsforholdType={arbeidsforholdType}
                onEnkeltdagChange={handleOnEnkeltdagChange}
            />
        );
    };

    return (
        <SøknadsperioderMånedListe
            månedContentRenderer={månedContentRenderer}
            periode={sakMetadata.endringsperiode}
            årstallHeadingLevel={3}
            årstallHeaderRenderer={(årstall) => `${årstall}`}
        />
    );
};

export default ArbeidstidMånedListe;
