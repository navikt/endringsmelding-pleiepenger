import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { K9Arbeidstid, K9SakMeta } from '../../types/K9Sak';
import { getArbeidsgiverArbeidstidFormFieldName, SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidMånedListe from './ArbeidstidMånedListe';
import SoknadFormComponents from '../SoknadFormComponents';
import { validateArbeidstidAlleArbeidsgivere } from '../../validation/fieldValidations';
import { useFormikContext } from 'formik';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    arbeidsgivere?: Arbeidsgiver[];
    k9sakMeta: K9SakMeta;
    arbeidstidSak: K9Arbeidstid;
    onArbeidstidChanged: () => void;
}

const ArbeidstidStep: React.FunctionComponent<Props> = ({
    arbeidsgivere,
    arbeidstidSak,
    k9sakMeta,
    onArbeidstidChanged,
}) => {
    const stepId = StepID.ARBEIDSTID;
    const { values } = useFormikContext<SoknadFormData>();

    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            {arbeidsgivere && (
                <SoknadFormComponents.InputGroup
                    name={'alle_arbeidsgivere_liste' as any}
                    validate={() => {
                        const result = validateArbeidstidAlleArbeidsgivere({
                            arbeidsgivereMap: values.arbeidstid?.arbeidsgiver,
                            arbeidsgivereSakMap: arbeidstidSak.arbeidsgivereMap,
                        });
                        return result;
                    }}>
                    <div className="arbeidstid">
                        {arbeidsgivere.map((a) => {
                            const arbeidstidArbeidsgiver = arbeidstidSak.arbeidsgivereMap[a.organisasjonsnummer];
                            return (
                                <div key={a.organisasjonsnummer} className="arbeidstid__arbeidsgiver">
                                    <Undertittel>
                                        {a.navn} ({a.organisasjonsnummer})
                                    </Undertittel>
                                    {arbeidstidArbeidsgiver === undefined ? (
                                        <p>Informasjon mangler om arbeidstid for denne arbeidsgiveren</p>
                                    ) : (
                                        <ArbeidstidMånedListe
                                            organisasjonsnummer={a.organisasjonsnummer}
                                            formFieldName={getArbeidsgiverArbeidstidFormFieldName(a)}
                                            arbeidstidArbeidsgiverSak={arbeidstidArbeidsgiver}
                                            k9sakMeta={k9sakMeta}
                                            onArbeidstidChanged={onArbeidstidChanged}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SoknadFormComponents.InputGroup>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidstidStep;
