import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import { arbeidstidMånedMessages } from '../soknad/arbeidstid-step/arbeidstid-måned/arbeidstidMånedMessages';
import { dinePlikterMessages } from '../soknad/inngang-step/dine-plikter/dinePlikterMessages';
import { personopplysningerMessages } from '../soknad/inngang-step/personopplysninger/personopplysningerMessages';
import { inngangFormMessages } from '../soknad/inngang-step/inngang-form/inngangFormMessages';
import omsorgstilbudMessages from '../soknad/omsorgstilbud-step/omsorgstilbudMessages';

const appMessagesNB = require('./nb.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...dinePlikterMessages.nb,
    ...personopplysningerMessages.nb,
    ...soknadErrorIntlMessages.nb,
    ...soknadIntlMessages.nb,
    ...omsorgstilbudMessages.nb,
    ...sifCommonPleiepengerMessages.nb,
    ...inngangFormMessages.nb,
    ...arbeidstidMånedMessages.nb,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
};
