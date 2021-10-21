import { DateRange } from '@navikt/sif-common-formik/lib';
import { K9Sak } from '../types/K9Sak';
import { dateIsWithinDateRange, ISODateToDate } from './dateUtils';
import { getEndringsdato, getMaksEndringsperiode } from './endringsperiode';

type ISODateObject = { [key: string]: any };

export const getISODateObjectsWithinDateRange = <E extends ISODateObject>(data: E, dateRange: DateRange): E => {
    const result = {};
    Object.keys(data).forEach((isoDate) => {
        if (dateIsWithinDateRange(ISODateToDate(isoDate), dateRange)) {
            result[isoDate] = data[isoDate];
        }
    });
    return result as E;
};

export const trimK9SakTilMaksEndringsperiode = (k9sak: K9Sak): K9Sak => {
    const sak: K9Sak = { ...k9sak };

    const maksEndringsperiode = getMaksEndringsperiode(getEndringsdato());

    const {
        ytelse: {
            arbeidstid: { arbeidsgivere },
            tilsynsordning: { enkeltdager: tilsynEnkeltdager },
        },
    } = sak;

    /** Trim arbeidstid ansatt */
    if (arbeidsgivere) {
        const trimmedArbeidsgivere = {}; //sak.ytelse.arbeidstid.arbeidsgivere = {};
        Object.keys(arbeidsgivere).forEach((key) => {
            trimmedArbeidsgivere[key] = {
                ...arbeidsgivere[key],
                arbeidstid: getISODateObjectsWithinDateRange(arbeidsgivere[key].arbeidstid, maksEndringsperiode),
            };
        });
        sak.ytelse.arbeidstid.arbeidsgivere = trimmedArbeidsgivere;
    }

    /** Trim tilsynsordning */
    if (tilsynEnkeltdager) {
        sak.ytelse.tilsynsordning.enkeltdager = getISODateObjectsWithinDateRange(
            tilsynEnkeltdager,
            maksEndringsperiode
        );
    }

    return sak;
};
