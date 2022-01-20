import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import arbeidstidMessages from '../soknad/arbeidstid-step/arbeidstidMessages';
import omsorgstilbudMessages from '../soknad/omsorgstilbud-step/omsorgstilbudMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
const appMessagesNB = require('./nb.json');
const dinePlikterNB = require('../soknad/velkommen-page/dine-plikter/dinePlikterNB.json');
const personopplysningerNB = require('../soknad/velkommen-page/personopplysninger/personopplysningerNB.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...dinePlikterNB,
    ...personopplysningerNB,
    ...soknadErrorIntlMessages.nb,
    ...soknadIntlMessages.nb,
    ...omsorgstilbudMessages.nb,
    ...arbeidstidMessages.nb,
    ...sifCommonPleiepengerMessages.nb,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
};
