import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import { arbeidstidMånedMessages } from '../soknad/arbeidstid-step/arbeidstid-måned/arbeidstidMånedMessages';
import omsorgstilbudMessages from '../soknad/omsorgstilbud-step/omsorgstilbudMessages';
import { velkommenPageFormMessages } from '../soknad/velkommen-page/velkommen-page-form/velkommenPageFormMessages';

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
    ...sifCommonPleiepengerMessages.nb,
    ...velkommenPageFormMessages.nb,
    ...arbeidstidMånedMessages.nb,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
};
