import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Undertittel } from 'nav-frontend-typografi';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { K9Arbeidstid } from '../../types/K9Sak';
import { getArbeidsgiverArbeidstidFormFieldName, SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidMånedListe from './ArbeidstidMånedListe';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    endringsdato: Date;
    arbeidsgivere?: Arbeidsgiver[];
    søknadsperioder: DateRange[];
    arbeidstidSak: K9Arbeidstid;
    onArbeidstidChanged: () => void;
}

const ArbeidstidStep: React.FunctionComponent<Props> = ({
    arbeidsgivere,
    endringsdato,
    arbeidstidSak,
    søknadsperioder,
    onArbeidstidChanged,
}) => {
    const stepId = StepID.ARBEIDSTID;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            {arbeidsgivere && (
                <>
                    {arbeidsgivere.map((a) => {
                        const arbeidstidArbeidsgiver = arbeidstidSak.arbeidsgivere[a.organisasjonsnummer];
                        return (
                            <FormBlock key={a.organisasjonsnummer}>
                                <Undertittel>{a.navn}</Undertittel>
                                {arbeidstidArbeidsgiver === undefined ? (
                                    <p>Informasjon mangler om arbeidstid for denne arbeidsgiveren</p>
                                ) : (
                                    <ArbeidstidMånedListe
                                        formFieldName={getArbeidsgiverArbeidstidFormFieldName(a)}
                                        endringsdato={endringsdato}
                                        søknadsperioder={søknadsperioder}
                                        arbeidstidSak={arbeidstidArbeidsgiver.faktisk}
                                        onArbeidstidChanged={onArbeidstidChanged}
                                    />
                                )}
                            </FormBlock>
                        );
                    })}
                </>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidstidStep;
