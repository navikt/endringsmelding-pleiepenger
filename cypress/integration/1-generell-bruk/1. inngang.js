const TestDate = require('../../fixtures/date.js');

describe('Generell flyt', () => {
    beforeEach(() => {
        cy.clock(TestDate, ['Date']);
    });

    it('siden lastes ok', () => {
        cy.visit('http://localhost:8090');
        cy.get('.typo-sidetittel', { timeout: 15000 }).should('contain.text', 'Melde endring i pleiepengeperioden');
    });

    it('kan velge å endre arbeidstid', () => {
        cy.clock(TestDate, ['Date']);
        cy.get('#inngangForm').within(() => {
            cy.get('#arbeidstid').should('exist');
            cy.get('#arbeidstid').parent().click();
        });
    });
    it('kan velge å endre omsorgstilbud', () => {
        cy.get('#inngangForm').within(() => {
            cy.get('#omsorgstilbud').should('exist');
            cy.get('#omsorgstilbud').parent().click();
        });
    });
    it('stoppes dersom en ikke bekrefter vilkår', () => {
        cy.get('button[type=submit]').click();
        cy.get('.bekreftCheckboksPanel').within(() => {
            cy.get('.skjemaelement__feilmelding').should('exist');
        });
    });
    it('kommer videre når en har bekreftet vilkår', () => {
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
    });

    it('viser arbeidstid-steg', () => {
        cy.get('.step__title').should('contain.text', 'Endre arbeidstimer');
    });

    it('test kun arbeidstid', () => {
        cy.visit('http://localhost:8090');
        cy.get('#arbeidstid').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre arbeidstimer');
    });
    it('test kun omsorgstilbud', () => {
        cy.visit('http://localhost:8090');
        cy.get('#omsorgstilbud').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre tid i omsorgstilbud');
    });
});
