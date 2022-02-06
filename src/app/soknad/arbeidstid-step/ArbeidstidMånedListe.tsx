import React from 'react';
import { ArbeidsforholdType, SøknadsperioderMånedListe } from '@navikt/sif-common-pleiepenger/lib';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import {
    DateDurationMap,
    DateRange,
    getDatesInDateRange,
    getDurationsInDateRange,
    getYearMonthKey,
    ISODateToDate,
    isValidDuration,
} from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { ArbeidstidEnkeltdagSak, SakMetadata } from '../../types/Sak';
import { ArbeidstidEnkeltdagSøknad, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { getDatesNotInDates } from '../../utils/arbeidUtils';
import ArbeidstidMåned from './arbeidstid-måned/ArbeidstidMåned';

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
    arbeidstidEnkeltdagSak,
    arbeidstidEnkeltdagSøknad,
    sakMetadata,
    onArbeidstidChanged,
}) => {
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const månedContentRenderer = (måned: DateRange) => {
        const dagerSak = getDurationsInDateRange(arbeidstidEnkeltdagSak.faktisk, måned);
        const dagerSøknad = getDurationsInDateRange(arbeidstidEnkeltdagSøknad.faktisk, måned);
        const datoerSomIkkeErTilgjengeligIMåned = getDatoerSomIkkeErTilgjengeligIMåned(måned, sakMetadata, dagerSak);

        const handleOnEnkeltdagChange = ({ dagerMedTid }: TidEnkeltdagEndring) => {
            const newValues: DateDurationMap = { ...arbeidstidEnkeltdagSøknad.faktisk };
            Object.keys(dagerMedTid).forEach((key) => {
                const dagHarTidISak = isValidDuration(dagerSak[key]);
                if (dagHarTidISak) {
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
                utilgjengeligeDatoer={datoerSomIkkeErTilgjengeligIMåned}
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
