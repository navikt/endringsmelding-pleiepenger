import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Arbeidsgiver, ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { SakMetadata, YtelseArbeidstid } from '../../types/Sak';
import {
    ArbeidstidFormValue,
    getArbeidsgiverArbeidstidFormFieldName,
    getFrilanserArbeidstidFormFieldName,
    getSelvstendigArbeidstidFormFieldName,
    SoknadFormData,
} from '../../types/SoknadFormData';
import { getArbeidstidForArbeidsgiver } from '../../utils/arbeidUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidAktivitet from './arbeidstid-aktivitet/ArbeidstidAktivitet';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    arbeidsgivere?: Arbeidsgiver[];
    sakMetadata: SakMetadata;
    arbeidstidSøknad: ArbeidstidFormValue;
    arbeidstidSak: YtelseArbeidstid;
    onArbeidstidChanged: () => void;
}
const ArbeidstidStep: React.FunctionComponent<Props> = ({
    arbeidsgivere,
    arbeidstidSak,
    sakMetadata,
    arbeidstidSøknad,
    onArbeidstidChanged,
}) => {
    const stepId = StepID.ARBEIDSTID;
    const { arbeidstakerMap } = arbeidstidSak;

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>
                <p>
                    Nedenfor ser du den tiden vi har registrert at du skal jobbe de dagene du har søkt om pleiepenger.
                </p>
                <p>
                    Du kan endre arbeidstiden din for enkeltdager ved å velge en dato i måneden, eller du kan legge til
                    endringer som gjelder flere dager ved å velge &quot;Endre dager i en periode&quot;-knappen.
                </p>
                <p>Når du har gjort en endring vil den opprinnelige tiden vises overstreket.</p>
            </StepIntroduction>
            {arbeidsgivere && arbeidsgivere.length > 0 && (
                <>
                    {arbeidsgivere.map((a) => {
                        const arbeidsgiverArbeidstid = arbeidstidSøknad.arbeidsgiver[a.id];
                        return arbeidsgiverArbeidstid ? (
                            <FormBlock margin="xxl" key={a.id} id={`arbeidsted-${a.id}`}>
                                <ArbeidstidAktivitet
                                    tittel={
                                        <>
                                            {a.navn}
                                            {a.type === ArbeidsgiverType.ORGANISASJON && <>(orgnr. {a.id})</>}
                                        </>
                                    }
                                    arbeidsstedNavn={a.navn}
                                    formFieldName={getArbeidsgiverArbeidstidFormFieldName(a)}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    arbeidstidEnkeltdagSøknad={arbeidsgiverArbeidstid}
                                    arbeidstidEnkeltdagSak={getArbeidstidForArbeidsgiver(a.id, arbeidstakerMap)}
                                    sakMetadata={sakMetadata}
                                    onArbeidstidChanged={onArbeidstidChanged}
                                />
                            </FormBlock>
                        ) : null;
                    })}
                </>
            )}

            {arbeidstidSak.frilanser && arbeidstidSøknad.frilanser && (
                <FormBlock margin="xxl" id={`arbeidsted-frilanser`}>
                    <ArbeidstidAktivitet
                        tittel="Frilanser"
                        arbeidsstedNavn="Frilanser"
                        formFieldName={getFrilanserArbeidstidFormFieldName()}
                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                        arbeidstidEnkeltdagSak={arbeidstidSak.frilanser}
                        arbeidstidEnkeltdagSøknad={arbeidstidSøknad.frilanser}
                        sakMetadata={sakMetadata}
                        onArbeidstidChanged={onArbeidstidChanged}
                    />
                </FormBlock>
            )}
            {arbeidstidSak.selvstendig && arbeidstidSøknad.selvstendig && (
                <FormBlock margin="xxl" id="arbeidsted-sn">
                    <ArbeidstidAktivitet
                        tittel="Selvstendig næringsdrivende"
                        arbeidsstedNavn="Selvstendig næringsdrivende"
                        formFieldName={getSelvstendigArbeidstidFormFieldName()}
                        arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                        arbeidstidEnkeltdagSak={arbeidstidSak.selvstendig}
                        arbeidstidEnkeltdagSøknad={arbeidstidSøknad.selvstendig}
                        sakMetadata={sakMetadata}
                        onArbeidstidChanged={onArbeidstidChanged}
                    />
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidstidStep;
