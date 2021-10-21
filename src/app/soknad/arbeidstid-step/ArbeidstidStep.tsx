import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Undertittel } from 'nav-frontend-typografi';
import SøknadsperioderMånedListe from '../../components/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { ArbeidstidSak } from '../../types/K9Sak';
import { SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
    return formData;
};

interface Props {
    endringsdato: Date;
    arbeidsgivere?: Arbeidsgiver[];
    søknadsperioder: DateRange[];
    arbeidstidSak: ArbeidstidSak;
}

const ArbeidstidStep: React.FunctionComponent<Props> = ({
    arbeidsgivere,
    endringsdato,
    arbeidstidSak,
    søknadsperioder,
}) => {
    const stepId = StepID.ARBEIDSTID;
    return (
        <SoknadFormStep id={stepId} onStepCleanup={cleanupStep}>
            <StepIntroduction>Intro til steg</StepIntroduction>
            {arbeidsgivere && (
                <>
                    {arbeidsgivere.map((a) => {
                        const arbeidstidArbeidsgiver = arbeidstidSak[a.organisasjonsnummer];
                        console.log(arbeidstidArbeidsgiver);

                        return (
                            <FormBlock key={a.organisasjonsnummer}>
                                <Undertittel>{a.navn}</Undertittel>
                                <SøknadsperioderMånedListe
                                    formFieldName={'abc' as any}
                                    legend="Tittel på skjemagruppe"
                                    månedContentRenderer={() => <div>måned</div>}
                                    søknadsperioder={søknadsperioder}
                                    endringsdato={endringsdato}
                                />
                            </FormBlock>
                        );
                    })}
                </>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidstidStep;
