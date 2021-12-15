import { fjernDagerMedUendretTid } from '../../tidsbrukUtils';

describe('fjernDagerMedUendretTid', () => {
    it('beholder dager dersom opprinneligTid ikke finnes for samme dag', () => {
        const result = fjernDagerMedUendretTid({ '2021-02-01': { hours: '3', minutes: '0' } }, {});
        expect(Object.keys(result).length).toBe(1);
    });

    it('beholder dager dersom opprinneligTid er ulik for samme dag', () => {
        const result = fjernDagerMedUendretTid(
            { '2021-02-01': { hours: '3', minutes: '0' } },
            { '2021-02-01': { hours: '3', minutes: '10' } }
        );
        expect(Object.keys(result).length).toBe(1);
    });
    it('fjerner dager dersom opprinneligTid er lik for samme dag', () => {
        const result = fjernDagerMedUendretTid(
            { '2021-02-01': { hours: '3', minutes: '10' } },
            { '2021-02-01': { hours: '3', minutes: '10' } }
        );
        expect(Object.keys(result).length).toBe(0);
    });
});
