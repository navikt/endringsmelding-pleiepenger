import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateToDate } from '../../dateUtils';
import { mapArbeidsgiverArbeidstidToApiData } from '../mapArbeidstidToApiData';

const søknadsperioder: DateRange[] = [
    {
        from: ISODateToDate('2021-02-01'),
        to: ISODateToDate('2021-02-04'),
    },
];

describe('mapArbeidsgiverArbeidstidToApiData', () => {
    it('returnerer tomt når ingen av dagene har endring ', () => {
        const result = mapArbeidsgiverArbeidstidToApiData(
            { '2021-02-01': { hours: '2' } },
            { '2021-02-01': { hours: '2' } },
            søknadsperioder
        );
        expect(result.length).toBe(0);
    });
    it('returnerer kun dager med endring ', () => {
        const result = mapArbeidsgiverArbeidstidToApiData(
            { '2021-02-01': { hours: '2' }, '2021-02-02': { hours: '2' } },
            { '2021-02-01': { hours: '2' } },
            søknadsperioder
        );
        expect(result.length).toBe(1);
        expect(result[0].dato).toEqual('2021-02-02');
        expect(result[0].tid).toEqual(timeToIso8601Duration({ hours: 2 }));
    });
});
