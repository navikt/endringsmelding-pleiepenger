import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Undertittel } from 'nav-frontend-typografi';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Arbeidsgiver, ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { K9Arbeidstid, K9SakMeta } from '../../types/K9Sak';
import {
    getArbeidsgiverArbeidstidFormFieldName,
    getFrilanserArbeidstidFormFieldName,
    getSelvstendigArbeidstidFormFieldName,
    SoknadFormData,
} from '../../types/SoknadFormData';
import { erNyttArbeidsforhold, getArbeidstidForArbeidsgiver } from '../../utils/arbeidssituasjonUtils';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidstidMånedListe from './ArbeidstidMånedListe';
import EndreArbeidstid from './endre-arbeidstid/EndreArbeidstid';

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
    const { arbeidstakerMap } = arbeidstidSak;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>
                <p>Her legger du inn endringer i hvor mange timer du jobber de dagene du har søkt om pleiepenger.</p>
            </StepIntroduction>
            {arbeidsgivere && (
                <FormBlock margin="m">
                    <SoknadFormComponents.InputGroup name={'alle_arbeidsgivere_liste' as any}>
                        <>
                            {arbeidsgivere.map((a) => {
                                const arbeidstidSak = getArbeidstidForArbeidsgiver(a.id, arbeidstakerMap);
                                const erNytt = erNyttArbeidsforhold(a.id, nyeArbeidsforhold);
                                return (
                                    <div key={a.id} className="arbeidstid__aktivitet">
                                        <Box padBottom="l">
                                            <Undertittel>
                                                {a.navn}
                                                {a.type === ArbeidsgiverType.ORGANISASJON && <>(orgnr. {a.id})</>}
                                            </Undertittel>
                                        </Box>
                                        <Box padBottom="l">
                                            <EndreArbeidstid
                                                arbeidsstedNavn={a.navn}
                                                endringsperiode={k9sakMeta.endringsperiode}
                                            />
                                        </Box>
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
                                <Box padBottom="l">
                                    <Undertittel>Frilanser</Undertittel>
                                </Box>
                                <Box padBottom="l">
                                    <EndreArbeidstid
                                        arbeidsstedNavn={'Frilanser'}
                                        endringsperiode={k9sakMeta.endringsperiode}
                                    />
                                </Box>
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
                                <Box padBottom="l">
                                    <Undertittel>Selvstendig næringsdrivende</Undertittel>
                                </Box>
                                <Box padBottom="l">
                                    <EndreArbeidstid
                                        arbeidsstedNavn={'Selvstendig næringsdrivende'}
                                        endringsperiode={k9sakMeta.endringsperiode}
                                    />
                                </Box>
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
