const TestDate = require('../../fixtures/date.js');

const tømMellomlagring = () => {
    if (Cypress.env('MSW_MODE') === 'dev') {
        cy.request('POST', 'http://localhost:8099/endringsmelding/mellomlagring', {});
    }
};

describe('Generell flyt', () => {
    beforeEach(() => {
        cy.clock(TestDate, ['Date']);
    });

    const ensureÅpentExpanderbartPanel = (idx) => {
        cy.get('.ekspanderbartPanel__hode')
            .eq(idx)
            .then(($button) => {
                if ($button.attr('aria-expanded') === 'false') {
                    $button.click();
                }
            });
    };

    const fyllUtOmsorgstilbudPeriodeForm = (fraDato, tilDato) => {
        cy.get('.omsorgstilbudPeriodeDialog').within(() => {
            cy.get('input[type=text]').eq(0).type('{selectall}').type(fraDato).blur();
            cy.get('input[type=text]').eq(1).type('{selectall}').type(tilDato).blur();
            cy.get('.timeInput__hours > input').eq(0).type('1');
            cy.get('.timeInput__minutes > input').eq(0).type('10');
            cy.get('.timeInput__hours > input').eq(1).type('2');
            cy.get('.timeInput__minutes > input').eq(1).type('20');
            cy.get('.timeInput__hours > input').eq(2).type('3');
            cy.get('.timeInput__minutes > input').eq(2).type('30');
            cy.get('.timeInput__hours > input').eq(3).type('4');
            cy.get('.timeInput__minutes > input').eq(3).type('40');
            cy.get('.timeInput__hours > input').eq(4).type('5');
            cy.get('.timeInput__minutes > input').eq(4).type('50');
            cy.get('button[type=submit]').click();
        });
    };

    it('tømmer mellomlagring dersom nødvendig', () => {
        tømMellomlagring();
    });

    it('velger å endre omsorgstilbud', () => {
        cy.visit('http://localhost:8090');
        cy.get('#omsorgstilbud').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre tid i omsorgstilbud');
    });
    it('kan åpne et ekspanderbart panel', () => {
        ensureÅpentExpanderbartPanel(0);
    });

    it('kan legge til omsorgstilbud for en periode', () => {
        ensureÅpentExpanderbartPanel(0);
        cy.get('button[name=leggTilPeriode]').click();
        fyllUtOmsorgstilbudPeriodeForm('2022-02-01', '2022-03-01');
        cy.get('.calendarGrid__day--button').eq(9).should('contain.text', '1 t.');
        cy.get('.calendarGrid__day--button').eq(9).should('contain.text', '10 m.');
        cy.get('.calendarGrid__day--button').eq(10).should('contain.text', '2 t.');
        cy.get('.calendarGrid__day--button').eq(10).should('contain.text', '20 m.');
        cy.get('.calendarGrid__day--button').eq(11).should('contain.text', '3 t.');
        cy.get('.calendarGrid__day--button').eq(11).should('contain.text', '30 m.');
        cy.get('.calendarGrid__day--button').eq(12).should('contain.text', '4 t.');
        cy.get('.calendarGrid__day--button').eq(12).should('contain.text', '40 m.');
        cy.get('.calendarGrid__day--button').eq(13).should('contain.text', '5 t.');
        cy.get('.calendarGrid__day--button').eq(13).should('contain.text', '50 m.');
    });

    it('kan legge til omsorgstilbud for én dag', () => {
        ensureÅpentExpanderbartPanel(1);
        cy.get('.ekspanderbartPanel')
            .eq(1)
            .within(() => {
                cy.get('.calendarGrid__day--button').first().click();
            });
        cy.get('.tidEnkeltdagDialog').within(() => {
            cy.get('.timeInput__hours').children('input').type('{selectall}').type('2');
            cy.get('.timeInput__minutes').children('input').type('{selectall}').type('30');
            cy.get('button[type=submit]').click();
        });
        cy.get('.ekspanderbartPanel')
            .eq(1)
            .within(() => {
                cy.get('.calendarGrid__day--button').eq(0).should('contain.text', '2 t.');
                cy.get('.calendarGrid__day--button').eq(0).should('contain.text', '30 m.');
            });
    });
    it('kan legge til omsorgstilbud for én dag som gjelder flere dager', () => {
        ensureÅpentExpanderbartPanel(1);
        cy.get('.ekspanderbartPanel')
            .eq(1)
            .within(() => {
                cy.get('.calendarGrid__day--button').first().click();
            });
        cy.get('.tidEnkeltdagDialog').within(() => {
            cy.get('.timeInput__hours').children('input').type('{selectall}').type('3');
            cy.get('.timeInput__minutes').children('input').type('{selectall}').type('33');
            cy.get('label').contains('Gjelder flere dager').click();
            cy.get('label').contains('Alle hverdager i uke').click();
            cy.get('button[type=submit]').click();
        });
        cy.get('.ekspanderbartPanel')
            .eq(1)
            .within(() => {
                cy.get('.calendarGrid__day--button').eq(0).should('contain.text', '3 t.');
                cy.get('.calendarGrid__day--button').eq(0).should('contain.text', '33 m.');
                cy.get('.calendarGrid__day--button').eq(1).should('contain.text', '3 t.');
                cy.get('.calendarGrid__day--button').eq(1).should('contain.text', '33 m.');
                cy.get('.calendarGrid__day--button').eq(2).should('contain.text', '3 t.');
                cy.get('.calendarGrid__day--button').eq(2).should('contain.text', '33 m.');
                cy.get('.calendarGrid__day--button').eq(3).should('contain.text', '0 t.');
                cy.get('.calendarGrid__day--button').eq(3).should('contain.text', '0 m.');
            });
    });
});
