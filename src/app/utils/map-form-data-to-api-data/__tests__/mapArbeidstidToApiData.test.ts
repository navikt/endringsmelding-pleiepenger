import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateToDate } from '../../dateUtils';
import { mapArbeidsgiverArbeidstidToK9FormatInnsending } from '../mapArbeidstidToK9Format';

const søknadsperioder: DateRange[] = [
    {
        from: ISODateToDate('2021-02-01'),
        to: ISODateToDate('2021-02-04'),
    },
];

describe('mapArbeidsgiverArbeidstidToApiData', () => {
    it('returnerer tomt når ingen av dagene har endring ', () => {
        const result = mapArbeidsgiverArbeidstidToK9FormatInnsending(
            { '2021-02-01': { hours: '2', minutes: undefined } },
            { '2021-02-01': { hours: '2', minutes: undefined } },
            søknadsperioder
        );
        expect(Object.keys(result).length).toEqual(0);
    });
    it('returnerer kun dager med endring ', () => {
        const result = mapArbeidsgiverArbeidstidToK9FormatInnsending(
            { '2021-02-01': { hours: '2', minutes: '20' }, '2021-02-02': { hours: '2', minutes: '20' } },
            { '2021-02-01': { hours: '2', minutes: '20' } },
            søknadsperioder
        );
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toEqual(1);
        expect(result['2021-02-02'].faktiskArbeidTimerPerDag).toEqual(timeToIso8601Duration({ hours: 2, minutes: 20 }));
    });
});
