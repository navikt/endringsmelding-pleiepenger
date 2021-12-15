import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateToDate } from '../../dateUtils';
import { timeToISODuration } from '../../timeUtils';
import { mapAktivitetArbeidstidToK9FormatInnsending } from '../mapArbeidstidToK9Format';

const søknadsperioder: DateRange[] = [
    {
        from: ISODateToDate('2021-02-01'),
        to: ISODateToDate('2021-02-04'),
    },
];

describe('mapAktivitetArbeidstidToK9FormatInnsending', () => {
    it('returnerer tomt når ingen av dagene har endring ', () => {
        const result = mapAktivitetArbeidstidToK9FormatInnsending(
            { '2021-02-01': { hours: '2', minutes: '0' } },
            {
                faktisk: { '2021-02-01': { hours: '2', minutes: '0' } },
                normalt: { '2021-02-01': { hours: '2', minutes: '0' } },
            },
            søknadsperioder
        );
        expect(Object.keys(result).length).toEqual(0);
    });
    it('returnerer kun dager med endring ', () => {
        const result = mapAktivitetArbeidstidToK9FormatInnsending(
            { '2021-02-01': { hours: '2', minutes: '20' }, '2021-02-02': { hours: '2', minutes: '20' } },
            {
                faktisk: { '2021-02-01': { hours: '2', minutes: '20' } },
                normalt: { '2021-02-01': { hours: '2', minutes: '20' }, '2021-02-02': { hours: '2', minutes: '20' } },
            },
            søknadsperioder
        );
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toEqual(1);
        expect(result['2021-02-02/2021-02-02'].faktiskArbeidTimerPerDag).toEqual(
            timeToISODuration({ hours: '2', minutes: '20' })
        );
    });
});
