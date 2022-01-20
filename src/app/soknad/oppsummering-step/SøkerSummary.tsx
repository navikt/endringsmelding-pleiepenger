import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Søker } from '../../types/Søker';

interface Props {
    søker: Søker;
}

const SøkerSummary: React.FunctionComponent<Props> = ({ søker }) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.søker.header')}>
            <SummaryBlock header={formatName(søker.fornavn, søker.etternavn, søker.mellomnavn)}>
                <FormattedMessage id="oppsummering.søker.fødselsnummer" />:{' '}
                <FødselsnummerSvar fødselsnummer={søker.fødselsnummer} />
            </SummaryBlock>
        </SummarySection>
    );
};

export default SøkerSummary;
