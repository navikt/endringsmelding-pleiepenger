import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { K9Arbeidstid, K9SakMeta } from '../../types/K9Sak';
import {
    getArbeidsgiverArbeidstidFormFieldName,
    getFrilanserArbeidstidFormFieldName,
    getSelvstendigArbeidstidFormFieldName,
    SoknadFormData,
} from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidMånedListe from './ArbeidstidMånedListe';
import SoknadFormComponents from '../SoknadFormComponents';
// import { validateAktivitetArbeidstid } from '../../validation/fieldValidations';
// import { useFormikContext } from 'formik';
import { erNyttArbeidsforhold, getArbeidstidForArbeidsgiver } from '../../utils/arbeidssituasjonUtils';
import dateFormatter from '../../utils/dateFormatterUtils';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    arbeidsgivere?: Arbeidsgiver[];
    k9sakMeta: K9SakMeta;
    arbeidstidSak: K9Arbeidstid;
    nyeArbeidsforhold: Arbeidsgiver[];
    onArbeidstidChanged: () => void;
}
const ArbeidstidStep: React.FunctionComponent<Props> = ({
    arbeidsgivere,
    arbeidstidSak,
    k9sakMeta,
    nyeArbeidsforhold,
    onArbeidstidChanged,
}) => {
    const stepId = StepID.ARBEIDSTID;
    // const { values } = useFormikContext<SoknadFormData>();
    const { arbeidstakerMap } = arbeidstidSak;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>
                <p>Her legger du inn endringer i hvor mange timer du jobber de dagene du har søkt om pleiepenger.</p>
            </StepIntroduction>
            {arbeidsgivere && (
                <FormBlock margin="m">
                    <SoknadFormComponents.InputGroup
                        name={'alle_arbeidsgivere_liste' as any}
                        // legend={<Undertittel>Perioder du kan endre arbeidstid</Undertittel>}
                        // description={
                        //     <>
                        //         Under ser du perioder du har søkt om pleiepenger. Det er kun dager du har søkt om
                        //         pleiepenger som er tilgjengelige for endring.{' '}
                        //     </>
                        // }
                        // validate={() => {
                        //     const result = validateAktivitetArbeidstid({
                        //         arbeidstid: values.arbeidstid,
                        //         arbeidstidSak,
                        //     });
                        //     return result;
                        // }}
                    >
                        <>
                            {arbeidsgivere.map((a) => {
                                const arbeidstidSak = getArbeidstidForArbeidsgiver(
                                    a.organisasjonsnummer,
                                    arbeidstakerMap
                                );
                                const erNytt = erNyttArbeidsforhold(a.organisasjonsnummer, nyeArbeidsforhold);
                                return (
                                    <div key={a.organisasjonsnummer} className="arbeidstid__aktivitet">
                                        <Undertittel>
                                            {a.navn} ({a.organisasjonsnummer})
                                        </Undertittel>
                                        {erNytt && (
                                            <Box margin="m">Startdato: {dateFormatter.extended(a.ansattFom)}</Box>
                                        )}
                                        <ArbeidstidMånedListe
                                            arbeidsstedNavn={a.navn}
                                            formFieldName={getArbeidsgiverArbeidstidFormFieldName(a)}
                                            arbeidstidSak={arbeidstidSak}
                                            k9sakMeta={k9sakMeta}
                                            startetDato={erNytt ? a.ansattFom : undefined}
                                            onArbeidstidChanged={onArbeidstidChanged}
                                        />
                                    </div>
                                );
                            })}
                        </>
                        {arbeidstidSak.frilanser && (
                            <div className="arbeidstid__aktivitet">
                                <Undertittel>Frilanser</Undertittel>
                                <ArbeidstidMånedListe
                                    arbeidsstedNavn="Frilanser"
                                    formFieldName={getFrilanserArbeidstidFormFieldName()}
                                    arbeidstidSak={arbeidstidSak.frilanser}
                                    k9sakMeta={k9sakMeta}
                                    onArbeidstidChanged={onArbeidstidChanged}
                                />
                            </div>
                        )}
                        {arbeidstidSak.selvstendig && (
                            <div className="arbeidstid__aktivitet">
                                <Undertittel>Selvstendig næringsdrivende</Undertittel>
                                <ArbeidstidMånedListe
                                    arbeidsstedNavn="Selvstendig næringsdrivende"
                                    formFieldName={getSelvstendigArbeidstidFormFieldName()}
                                    arbeidstidSak={arbeidstidSak.selvstendig}
                                    k9sakMeta={k9sakMeta}
                                    onArbeidstidChanged={onArbeidstidChanged}
                                />
                            </div>
                        )}
                    </SoknadFormComponents.InputGroup>
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidstidStep;
