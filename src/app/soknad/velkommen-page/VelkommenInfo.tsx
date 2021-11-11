import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

const VelkommenInfo: React.FunctionComponent = () => {
    const intl = useIntl();
    return 1 + 1 === 2 ? (
        <>
            <p>
                Her kan du melde fra om endringer i tiden barnet er fast og regelmessig i et omsorgstilbud, samt hvor
                mye du jobber mens du har pleiepenger. Du kan legge til, fjerne eller endre arbeidstid og tid i
                omsorgstilbud.
            </p>
            <p>
                Du kan melde fra om endringer i pleiepengeperioden din i opptil 3 måneder tilbake i tid, og 12 måneder
                frem i tid. Hvis du har behov for å melde fra om endringer utenfor denne tidsrammen må du sende en
                melding via <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">Skriv til oss</Lenke>.
            </p>
        </>
    ) : (
        <>
            <p>
                <FormattedMessage id="step.velkommen.info.1.1" />
                {` `}
                <Lenke href={getLenker().skrivTilOss}>
                    <FormattedMessage id="step.velkommen.info.1.2" />
                </Lenke>
                <FormattedMessage id="step.velkommen.info.1.3" />
            </p>
            <Box margin="l">
                <Element tag="p">
                    <FormattedMessage id="step.velkommen.info.2" />
                </Element>
                <ul>
                    <li>
                        <FormattedMessage id="step.velkommen.info.2.1" />
                    </li>
                </ul>
            </Box>
            <Box margin="l">
                <Element tag="p">
                    <FormattedMessage id="step.velkommen.info.3" />
                </Element>
                <ul>
                    <li>
                        <FormattedMessage id="step.velkommen.info.3.1" />
                    </li>
                    <li>
                        <FormattedMessage id="step.velkommen.info.3.2" />
                    </li>
                </ul>
            </Box>
            <p>
                <FormattedMessage id="step.velkommen.info.4" />
            </p>
            <Box margin="l">
                <ExpandableInfo title={intlHelper(intl, 'step.velkommen.info.5.tittel')}>
                    <FormattedMessage id="step.velkommen.info.5.tekst" />
                </ExpandableInfo>
            </Box>
            <Box margin="l">
                <Element tag="h2">
                    <FormattedMessage id="step.velkommen.info.6" />
                </Element>
            </Box>
            <p>
                <FormattedMessage id="step.velkommen.info.7.1" />
                {` `}
                <Lenke href={getLenker().skrivTilOss}>
                    <FormattedMessage id="step.velkommen.info.7.2" />
                </Lenke>
                <FormattedMessage id="step.velkommen.info.7.3" />
            </p>
        </>
    );
};

export default VelkommenInfo;
