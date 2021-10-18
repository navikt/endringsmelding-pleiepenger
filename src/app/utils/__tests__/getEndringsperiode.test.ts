import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange } from '../dateUtils';
import { getEndringsperiode } from '../getEndringsperiode';

describe('getEndringsperiode', () => {
    it('returnerer maks endringsdato dersom søknadsperiode er større enn endringsperiode', () => {
        const endringsdato: Date = apiStringDateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2020-01-01/2023-12-01');
        const result = getEndringsperiode(endringsdato, søknadsperiode);
        expect(result).toBeDefined();
        expect(dateToISOString(result.from)).toEqual('2020-11-01');
        expect(dateToISOString(result.to)).toEqual('2022-02-01');
    });
    it('returnerer søknadsperiode datoer dersom søknadsperiode er innenfor enn endringsperiode', () => {
        const endringsdato: Date = apiStringDateToDate('2021-02-01');
        const søknadsperiode: DateRange = ISODateRangeToDateRange('2021-01-01/2021-03-01');
        const result = getEndringsperiode(endringsdato, søknadsperiode);
        expect(result).toBeDefined();
        expect(dateToISOString(result.from)).toEqual('2021-01-01');
        expect(dateToISOString(result.to)).toEqual('2021-03-01');
    });
});
