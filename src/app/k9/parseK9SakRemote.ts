import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { K9Sak } from '../types/K9Sak';
import { ISODateRangeToDateRange } from '../utils/dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from '../utils/endringsperiode';
import { getArbeidstidFromK9Format } from './getArbeidstidFromK9Format';
import { getTilsynsdagerFromK9Format } from './getTilsynsdagerFromK9Format';
import { K9SakRemote } from './k9SakRemote';

export const parseK9SakRemote = (data: K9SakRemote, maxRange?: DateRange): K9Sak => {
    const { ytelse, søker, søknadId } = data;
    const endringsdato = getEndringsdato();
    const sak: K9Sak = {
        søker: søker,
        søknadId: søknadId,
        ytelse: {
            type: 'PLEIEPENGER_SYKT_BARN',
            barn: {
                fødselsdato: apiStringDateToDate(ytelse.barn.fødselsdato),
                norskIdentitetsnummer: ytelse.barn.norskIdentitetsnummer,
            },
            søknadsperioder: getSøknadsperioderInnenforTillattEndringsperiode(
                endringsdato,
                ytelse.søknadsperiode.map((periode) => ISODateRangeToDateRange(periode))
            ),
            tilsynsordning: {
                enkeltdager: getTilsynsdagerFromK9Format(ytelse.tilsynsordning.perioder),
            },
            arbeidstid: {
                arbeidsgivere: ytelse.arbeidstid.arbeidstakerList.map((a) => ({
                    orgnr: a.organisasjonsnummer,
                    arbeidstid: getArbeidstidFromK9Format(a.arbeidstidInfo.perioder, maxRange),
                })),
            },
        },
    };
    return sak;
};
