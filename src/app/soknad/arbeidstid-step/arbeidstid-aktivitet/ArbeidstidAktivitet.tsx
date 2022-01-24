import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { Undertittel } from 'nav-frontend-typografi';
import { ArbeidstidEnkeltdagSak, SakMetadata } from '../../../types/Sak';
import { ArbeidstidEnkeltdagSøknad, SoknadFormField } from '../../../types/SoknadFormData';
import ArbeidstidMånedListe from '../ArbeidstidMånedListe';
import EndreArbeidstidPeriode from '../endre-arbeidstid-periode/EndreArbeidstidPeriode';

interface Props {
    tittel: string | JSX.Element;
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    sakMetadata: SakMetadata;
    formFieldName: SoknadFormField;
    arbeidstidSak: ArbeidstidEnkeltdagSak;
    arbeidstidEnkeltdagSøknad: ArbeidstidEnkeltdagSøknad;
    onArbeidstidChanged?: () => void;
}

const ArbeidstidAktivitet: React.FunctionComponent<Props> = ({
    tittel,
    arbeidsforholdType,
    arbeidsstedNavn,
    sakMetadata,
    formFieldName,
    arbeidstidSak,
    arbeidstidEnkeltdagSøknad,
    onArbeidstidChanged,
}) => {
    return (
        <>
            <Box padBottom="l">
                <Undertittel>{tittel}</Undertittel>
            </Box>
            <ResponsivePanel border={false}>
                <Box padBottom="l">
                    <EndreArbeidstidPeriode
                        dagerSøktForMap={sakMetadata.dagerSøktForMap}
                        arbeidstidEnkeltdagSøknad={arbeidstidEnkeltdagSøknad}
                        formFieldName={formFieldName}
                        arbeidsstedNavn={arbeidsstedNavn}
                        endringsperiode={sakMetadata.endringsperiode}
                        onArbeidstidChanged={onArbeidstidChanged}
                    />
                </Box>
                <ArbeidstidMånedListe
                    arbeidsstedNavn={arbeidsstedNavn}
                    arbeidsforholdType={arbeidsforholdType}
                    formFieldName={formFieldName}
                    arbeidstidEnkeltdagSak={arbeidstidSak}
                    arbeidstidEnkeltdagSøknad={arbeidstidEnkeltdagSøknad}
                    sakMetadata={sakMetadata}
                    onArbeidstidChanged={onArbeidstidChanged}
                />
            </ResponsivePanel>
        </>
    );
};

export default ArbeidstidAktivitet;
