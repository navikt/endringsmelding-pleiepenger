import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { K9Arbeidstid, K9Sak } from '../types/K9Sak';
import { ISODateRangeToDateRange } from '../utils/dateUtils';
import { getEndringsdato, getSøknadsperioderInnenforTillattEndringsperiode } from '../utils/endringsperiode';
import { getArbeidsgiverArbeidstidFromK9Format } from './getArbeidstidFromK9Format';
import { getTilsynsdagerFromK9Format } from './getTilsynsdagerFromK9Format';
import { ArbeidsgiverK9, K9SakRemote } from './k9SakRemote';

const getArbeidstidArbeidsgivere = (arbeidsgivere: ArbeidsgiverK9[]): K9Arbeidstid => {
    const arbeidstid: K9Arbeidstid = {
        arbeidsgivere: {},
    };
    arbeidsgivere.forEach((a) => {
        arbeidstid.arbeidsgivere[a.organisasjonsnummer] = getArbeidsgiverArbeidstidFromK9Format(
            a.arbeidstidInfo.perioder
        );
    });
    return arbeidstid;
};

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
            arbeidstid: getArbeidstidArbeidsgivere(ytelse.arbeidstid.arbeidstakerList),
        },
        meta: {
            dagerIkkeSøktFor: {},
        },
    };
    return sak;
};
