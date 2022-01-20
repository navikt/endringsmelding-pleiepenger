import { DateDurationMap } from '@navikt/sif-common-utils/lib';
import { getDagerMedGyldigArbeidstidISak, getDagerMedIkkeGyldigArbeidstidISak } from '../arbeidUtils';

describe('arbeidUtils', () => {
    const dager: DateDurationMap = {
        '2020-01-01': {
            hours: '0',
            minutes: '0',
        },
        '2020-01-02': {
            hours: '0',
            minutes: '0',
        },
    };
    const dagerSak: DateDurationMap = {
        '2020-01-01': {
            hours: '0',
            minutes: '0',
        },
    };

    describe('getDagerMedGyldigArbeidstidISak', () => {
        it('returnerer kun dager som har gyldig tid i sak', () => {
            const result = getDagerMedGyldigArbeidstidISak(dager, dagerSak);
            expect(Object.keys(result).length).toBe(1);
            expect(result['2020-01-01']).toBeDefined();
            expect(result['2020-01-02']).toBeUndefined();
        });
    });
    describe('getDagerMedIkkeGyldigArbeidstidISak', () => {
        it('returnerer kun dager som ikke har gyldig tid i sak', () => {
            const result = getDagerMedIkkeGyldigArbeidstidISak(dager, dagerSak);
            expect(Object.keys(result).length).toBe(1);
            expect(result['2020-01-01']).toBeUndefined();
            expect(result['2020-01-02']).toBeDefined();
        });
    });
});
