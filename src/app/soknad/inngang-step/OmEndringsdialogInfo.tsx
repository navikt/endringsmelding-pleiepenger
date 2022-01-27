import React from 'react';
import Lenke from 'nav-frontend-lenker';

const OmEndringsdialogInfo: React.FunctionComponent = () => {
    return (
        <>
            <p>
                Her kan du melde fra om endringer i tiden barnet er fast og regelmessig i omsorgstilbud, samt hvor mye
                du jobber mens du har pleiepenger.
            </p>
            <p>
                Du kan melde fra om endringer i pleiepengeperioden din i opptil 3 måneder tilbake i tid, og 6 måneder
                frem i tid. Hvis du har behov for å melde fra om endringer utenfor denne tidsrammen, eller du har behov
                for å melde fra om andre endringer, må du sende en melding via{' '}
                <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">Skriv til oss</Lenke>.
            </p>
        </>
    );
};

export default OmEndringsdialogInfo;
