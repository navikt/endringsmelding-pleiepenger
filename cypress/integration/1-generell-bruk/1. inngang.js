const TestDate = require('../../fixtures/date.js');

const tømMellomlagring = () => {
    if (Cypress.env('MSW_MODE') === 'dev') {
        cy.request('POST', 'http://localhost:8099/endringsmelding/mellomlagring', {});
    }
};

describe('Overordnet flyt', () => {
    beforeEach(() => {
        cy.clock(TestDate, ['Date']);
    });

    it('tømmer mellomlagring dersom i dev', () => {
        tømMellomlagring();
    });

    it('siden lastes ok', () => {
        cy.visit('http://localhost:8090');
        cy.get('.typo-sidetittel', { timeout: 15000 }).should('contain.text', 'Melde endring i pleiepengeperioden');
    });

    it('kan velge å endre arbeidstid', () => {
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
        tømMellomlagring();
        cy.visit('http://localhost:8090');
        cy.get('#arbeidstid').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre arbeidstimer');
    });
    it('test kun omsorgstilbud', () => {
        tømMellomlagring();
        cy.visit('http://localhost:8090');
        cy.get('#omsorgstilbud').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre tid i omsorgstilbud');
    });
});
