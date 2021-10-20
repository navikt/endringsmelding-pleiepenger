import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { K9Sak } from '../../types/K9Sak';
import { ISODateRangeToDateRange } from '../../utils/dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from '../../utils/endringsperiode';
import { getTilsynsdagerFromK9Format } from './getTilsynsdagerFromK9Format';
import { K9SakRemote } from './k9SakRemote';

export const parseK9SakRemote = (data: K9SakRemote): K9Sak => {
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
        },
    };
    return sak;
};
