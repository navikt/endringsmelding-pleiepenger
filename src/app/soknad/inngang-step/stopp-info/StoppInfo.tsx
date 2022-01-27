import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { StoppÅrsak } from '../../../utils/gatekeeper';

interface Props {
    stoppÅrsak: StoppÅrsak;
}

const StoppInfo: React.FunctionComponent<Props> = ({ stoppÅrsak }) => {
    switch (stoppÅrsak) {
        case StoppÅrsak.harIngenSak:
            return (
                <AlertStripeInfo>
                    <p>Vi kunne ikke finne noen pleiepengesak registrert på deg.</p>
                </AlertStripeInfo>
            );
        case StoppÅrsak.arbeidsgiverSakErIkkeIAareg:
        case StoppÅrsak.arbeidIkkeRegistrert:
        case StoppÅrsak.harFlereSaker:
        case StoppÅrsak.harPrivatArbeidsgiver:
            return (
                <AlertStripeInfo>
                    <p>Du kan dessverre ikke bruke denne løsningen enda. For å melde endring, må du abc</p>
                    {stoppÅrsak && <p>Årsak: {stoppÅrsak}</p>}
                </AlertStripeInfo>
            );
    }
};

export default StoppInfo;
