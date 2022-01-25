import { DateRange } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { dateToISODate, ISODateRangeToDateRange, ISODateToDate } from '@navikt/sif-common-utils';
import {
    getEndringsperiode,
    getMaksEndringsperiode,
    getSøknadsperioderInnenforTillattEndringsperiode,
} from '../endringsperiode';

describe('getEndringsperiode', () => {
    it('returnerer maks endringsdato dersom søknadsperiode er større enn endringsperiode', () => {
        /** Forutsetter maks periode til å være 6 måneder frem i tid fra dagens dato */
        const endringsdato: Date = ISODateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2020-01-01/2023-12-01');
        const result = getEndringsperiode(endringsdato, [søknadsperiode]);
        expect(result).toBeDefined();
        expect(dateToISODate(result.from)).toEqual('2020-11-01');
        expect(dateToISODate(result.to)).toEqual('2021-08-01');
    });
    it('returnerer søknadsperiode datoer dersom søknadsperiode er innenfor enn endringsperiode', () => {
        const endringsdato: Date = ISODateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2021-01-01/2021-03-01');
        const result = getEndringsperiode(endringsdato, [søknadsperiode]);
        expect(result).toBeDefined();
        expect(dateToISODate(result.from)).toEqual('2021-01-01');
        expect(dateToISODate(result.to)).toEqual('2021-03-01');
    });
});

describe('getSøknadsperioderInnenforTillattEndringsperiode', () => {
    const endringsdato = ISODateToDate('2021-02-01');
    const maksgrense = getMaksEndringsperiode(endringsdato);
    const søknadsperioderEn: DateRange = ISODateRangeToDateRange('2021-01-01/2021-03-01');

    it('returnerer periode start/slutt innenfor maksgrense', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [søknadsperioderEn]);
        expect(result.length).toBe(1);
        expect(dateToISODate(result[0].from)).toEqual('2021-01-01');
        expect(dateToISODate(result[0].to)).toEqual('2021-03-01');
    });

    it('fjerner perioder som avsluttes før maksgrense.from', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [
            {
                from: dayjs(maksgrense.from).subtract(2, 'day').toDate(),
                to: dayjs(maksgrense.from).subtract(1, 'day').toDate(),
            },
        ]);
        expect(result.length).toBe(0);
    });

    it('fjerner perioder som starter etter maksgrense.to', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [
            { from: dayjs(maksgrense.to).add(1, 'day').toDate(), to: dayjs(maksgrense.to).add(2, 'day').toDate() },
        ]);
        expect(result.length).toBe(0);
    });

    it('returnerer maks grense når perioder starter og slutter utenfor maksgrense', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [
            {
                from: new Date(2000, 1, 1),
                to: new Date(2030, 1, 1),
            },
        ]);
        expect(result.length).toBe(1);
        expect(dateToISODate(result[0].from)).toEqual(dateToISODate(maksgrense.from));
        expect(dateToISODate(result[0].to)).toEqual(dateToISODate(maksgrense.to));
    });
    it('avkorter perioder som starter og slutter utenfor maks grense', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [
            {
                from: dayjs(maksgrense.from).subtract(10, 'day').toDate(),
                to: dayjs(maksgrense.from).add(1, 'day').toDate(),
            },
            {
                from: dayjs(maksgrense.to).subtract(10, 'day').toDate(),
                to: dayjs(maksgrense.to).add(1, 'day').toDate(),
            },
        ]);
        expect(result.length).toBe(2);
        expect(dateToISODate(result[0].from)).toEqual(dateToISODate(maksgrense.from));
        expect(dateToISODate(result[1].to)).toEqual(dateToISODate(maksgrense.to));
    });
});
