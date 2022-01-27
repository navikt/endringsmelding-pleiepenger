import { DateRange, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidstidEnkeltdagSak } from '../../types/Sak';
import { ArbeidstidEnkeltdagSøknad } from '../../types/SoknadFormData';
import { mapAktivitetArbeidstidToK9FormatInnsending } from '../map-form-data-to-api-data/mapArbeidstidToK9Format';

jest.mock('../appSentryLogger', () => {
    return { logError: () => null };
});

const ISODag = '2021-01-01';
const ISODagDuration = '2021-01-01/2021-01-01';
const ISODagUtenforSøknadsperiode = '2021-02-01';
const ISODagUtenforSøknadsperiodeDuration = '2021-02-01/2021-02-01';

const søknadsperioder: DateRange[] = [
    {
        from: ISODateToDate(ISODag),
        to: ISODateToDate('2021-01-31'),
    },
];

const arbeidstidEnkeltdager: ArbeidstidEnkeltdagSøknad = {
    faktisk: {
        [ISODag]: { hours: '1', minutes: '0' },
        [ISODagUtenforSøknadsperiode]: { hours: '2', minutes: '30' },
    },
    normalt: {
        [ISODag]: { hours: '7', minutes: '30' },
        [ISODagUtenforSøknadsperiode]: { hours: '7', minutes: '30' },
    },
};

const arbeidstidSak: ArbeidstidEnkeltdagSak = {
    faktisk: { [ISODag]: { hours: '5', minutes: '0' } },
    normalt: {
        [ISODag]: { hours: '8', minutes: '0' },
    },
};
describe('mapAktivitetArbeidstidToK9FormatInnsending', () => {
    it('mapper om arbeidstid for en aktivitet korrekt', () => {
        const result = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstidEnkeltdager.faktisk,
            arbeidstidSak,
            søknadsperioder
        );
        expect(result[ISODagDuration].faktiskArbeidTimerPerDag).toEqual('PT1H0M');
        expect(result[ISODagDuration].jobberNormaltTimerPerDag).toEqual('PT8H0M');
    });
    it('tar ikke med arbeidstid utenfor søknadsperiode', () => {
        const result = mapAktivitetArbeidstidToK9FormatInnsending(
            arbeidstidEnkeltdager.faktisk,
            arbeidstidSak,
            søknadsperioder
        );
        expect(result[ISODagUtenforSøknadsperiodeDuration]).toBeUndefined();
    });
});

// describe('mapArbeidstidToK9FormatInnsending', () => {
//     const arbeidstidFormValues: ArbeidstidFormValue = {
//         arbeidsgiver: {
//             '123': arbeidstidEnkeltdager,
//         },
//     };
// });
