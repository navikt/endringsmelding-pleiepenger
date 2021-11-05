import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import arbeidstidMessages from '../soknad/arbeidstid-step/arbeidstidMessages';
import omsorgstilbudMessages from '../soknad/omsorgstilbud-step/omsorgstilbudMessages';
import arbeidssituasjonMessages from '../soknad/arbeidssituasjon-step/arbeidssituasjonMessages';

const appMessagesNB = require('./nb.json');
const introFormMessagesNB = require('../pages/intro-page/introFormMessagesNB.json');
const dinePlikterNB = require('../soknad/velkommen-page/dine-plikter/dinePlikterNB.json');
const personopplysningerNB = require('../soknad/velkommen-page/personopplysninger/personopplysningerNB.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...introFormMessagesNB,
    ...dinePlikterNB,
    ...personopplysningerNB,
    ...soknadErrorIntlMessages.nb,
    ...soknadIntlMessages.nb,
    ...omsorgstilbudMessages.nb,
    ...arbeidstidMessages.nb,
    ...arbeidssituasjonMessages.nb,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
};
