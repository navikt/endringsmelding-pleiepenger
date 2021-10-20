import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { ISODateRangeToDateRange } from '../dateUtils';
import {
    getEndringsperiode,
    getMaksEndringsperiode,
    getSøknadsperioderInnenforTillattEndringsperiode,
} from '../endringsperiode';

describe('getEndringsperiode', () => {
    it('returnerer maks endringsdato dersom søknadsperiode er større enn endringsperiode', () => {
        const endringsdato: Date = apiStringDateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2020-01-01/2023-12-01');
        const result = getEndringsperiode(endringsdato, [søknadsperiode]);
        expect(result).toBeDefined();
        expect(dateToISOString(result.from)).toEqual('2020-11-01');
        expect(dateToISOString(result.to)).toEqual('2022-02-01');
    });
    it('returnerer søknadsperiode datoer dersom søknadsperiode er innenfor enn endringsperiode', () => {
        const endringsdato: Date = apiStringDateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2021-01-01/2021-03-01');
        const result = getEndringsperiode(endringsdato, [søknadsperiode]);
        expect(result).toBeDefined();
        expect(dateToISOString(result.from)).toEqual('2021-01-01');
        expect(dateToISOString(result.to)).toEqual('2021-03-01');
    });
});

describe('getSøknadsperioderInnenforTillattEndringsperiode', () => {
    const endringsdato = apiStringDateToDate('2021-02-01');
    const maksgrense = getMaksEndringsperiode(endringsdato);
    const søknadsperioderEn: DateRange = ISODateRangeToDateRange('2021-01-01/2021-03-01');

    it('returnerer periode start/slutt innenfor maksgrense', () => {
        const result = getSøknadsperioderInnenforTillattEndringsperiode(endringsdato, [søknadsperioderEn]);
        expect(result.length).toBe(1);
        expect(dateToISOString(result[0].from)).toEqual('2021-01-01');
        expect(dateToISOString(result[0].to)).toEqual('2021-03-01');
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
        expect(dateToISOString(result[0].from)).toEqual(dateToISOString(maksgrense.from));
        expect(dateToISOString(result[0].to)).toEqual(dateToISOString(maksgrense.to));
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
        expect(dateToISOString(result[0].from)).toEqual(dateToISOString(maksgrense.from));
        expect(dateToISOString(result[1].to)).toEqual(dateToISOString(maksgrense.to));
    });
});
