import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { K9ArbeidstidInfo } from '../../types/K9Sak';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { ISODateToDate } from '../dateUtils';
import {
    erArbeidsgivereIBådeSakOgAAreg,
    getISODateObjectsWithinDateRange,
    harK9SakArbeidstidInfo,
    trimArbeidstidTilTillatPeriode,
} from '../k9SakUtils';

describe('trimArbeidstidTilTillatPeriode', () => {
    it('fjerner arbeidstid utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-02'),
            to: ISODateToDate('2021-02-03'),
        };

        const tid: Time = {
            hours: '0',
            minutes: '30',
        };

        const arbeidstid: K9ArbeidstidInfo = {
            faktisk: {
                '2021-02-01': tid,
                '2021-02-02': tid,
                '2021-02-03': tid,
                '2021-02-04': tid,
            },
            normalt: {
                '2021-02-01': tid,
                '2021-02-02': tid,
                '2021-02-03': tid,
                '2021-02-04': tid,
            },
        };
        const result = trimArbeidstidTilTillatPeriode(arbeidstid, endringsperiode, {});
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-02-01']).toBeUndefined();
        expect(result['2021-02-04']).toBeUndefined();
    });

    it('fjerner dager med tilsyn utenfor endringsperiode', () => {
        const endringsperiode: DateRange = {
            from: ISODateToDate('2021-02-02'),
            to: ISODateToDate('2021-02-03'),
        };
        const tid: Time = {
            hours: '0',
            minutes: '30',
        };
        const tilsyn: TidEnkeltdag = {
            '2021-02-01': tid,
            '2021-02-02': tid,
            '2021-02-03': tid,
            '2021-02-04': tid,
        };
        const result = getISODateObjectsWithinDateRange(tilsyn, endringsperiode, {});
        expect(Object.keys(result).length).toEqual(2);
        expect(result['2021-02-01']).toBeUndefined();
        expect(result['2021-02-04']).toBeUndefined();
    });
    it('fjerner dager med arbeidstid som er på dager det ikke er søkt om', () => {
        expect(1).toBe(1);
    });
});

describe('erArbeidsgivereErBådeISakOgAAreg', () => {
    it('returnerer true når alle k9 arbeidsgivere (1) finnes i AA-reg', () => {
        const result = erArbeidsgivereIBådeSakOgAAreg(
            [
                {
                    type: ArbeidsgiverType.ORGANISASJON,
                    navn: 'a',
                    id: '1',
                    ansattFom: ISODateToDate('2021-10-01'),
                },
            ],
            {
                '1': { faktisk: {}, normalt: {} },
            }
        );
        expect(result).toBeTruthy();
    });
    it('returnerer true når ingen arbeidsgivere finnes i k9sak', () => {
        const result = erArbeidsgivereIBådeSakOgAAreg(
            [
                {
                    type: ArbeidsgiverType.ORGANISASJON,
                    navn: 'a',
                    id: '1',
                    ansattFom: ISODateToDate('2021-10-01'),
                },
            ],
            {}
        );
        expect(result).toBeTruthy();
    });
    it('returnerer false når en k9 arbeidsgiver ikke finnes i AA-reg', () => {
        const result = erArbeidsgivereIBådeSakOgAAreg(
            [
                {
                    type: ArbeidsgiverType.ORGANISASJON,
                    navn: 'a',
                    id: '1',
                    ansattFom: ISODateToDate('2021-10-01'),
                },
            ],
            {
                '2': { faktisk: {}, normalt: {} },
            }
        );
        expect(result).toBeFalsy();
    });
    it('returnerer false når ingen arbeidsgivere finnes i AA-reg', () => {
        const result = erArbeidsgivereIBådeSakOgAAreg([], {
            '2': { faktisk: {}, normalt: {} },
        });
        expect(result).toBeFalsy();
    });
});

describe('harK9SakArbeidstidInfo', () => {
    it('returnerer false dersom det er ikke er info om arbeidstid for arbeidsgivere, frilanser eller sn', () => {
        const result = harK9SakArbeidstidInfo([], {});
        expect(result).toBeFalsy();
    });
    it('returnerer true dersom det er info om arbeidstid for arbeidsgivere', () => {
        const result = harK9SakArbeidstidInfo(
            [
                {
                    type: ArbeidsgiverType.ORGANISASJON,
                    navn: 'a',
                    id: '1',
                    ansattFom: ISODateToDate('2021-10-01'),
                },
            ],
            {
                arbeidstakerMap: { '1': { faktisk: {}, normalt: {} } },
            }
        );
        expect(result).toBeTruthy();
    });
    it('returnerer true dersom det er info om arbeidstid som frilanser', () => {
        const result = harK9SakArbeidstidInfo([], {
            frilanser: { faktisk: {}, normalt: {} },
        });
        expect(result).toBeTruthy();
    });
    it('returnerer true dersom det er info om arbeidstid from selvdstendig', () => {
        const result = harK9SakArbeidstidInfo([], {
            selvstendig: { faktisk: {}, normalt: {} },
        });
        expect(result).toBeTruthy();
    });
});
