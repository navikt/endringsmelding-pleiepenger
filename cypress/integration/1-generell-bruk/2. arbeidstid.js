const TestDate = require('../../fixtures/date.js');

describe('Arbeidstid', () => {
    beforeEach(() => {
        cy.clock(TestDate, ['Date']);
    });
    const fyllUtArbeidEnkeltdagForm = () => {
        cy.get('.tidEnkeltdagDialog').within(() => {
            cy.get('.timeInput__hours').children('input').type('{selectall}').type('2');
            cy.get('.timeInput__minutes').children('input').type('{selectall}').type('30');
            cy.get('button[type=submit]').click();
        });
    };

    const fyllUtArbeidIPeriodeForm = (brukProsent, fraDato, tilDato) => {
        cy.get('.arbeidstidPeriodeDialog').within(() => {
            cy.get('input[type=text]').eq(0).type('{selectall}').type(fraDato).blur();
            cy.get('input[type=text]').eq(1).type('{selectall}').type(tilDato).blur();
            if (brukProsent === true) {
                cy.get('input[value=prosent]').parent().click();
                cy.get('input[name=prosent]').type('50');
            } else {
                cy.get('input[value=tidFasteDager]').parent().click();
                cy.get('.timeInput__hours > input').eq(0).type('1');
                cy.get('.timeInput__minutes > input').eq(0).type('10');
                cy.get('.timeInput__hours > input').eq(1).type('0');
                cy.get('.timeInput__minutes > input').eq(1).type('0');
                cy.get('.timeInput__hours > input').eq(2).type('3');
                cy.get('.timeInput__minutes > input').eq(2).type('30');
                cy.get('.timeInput__hours > input').eq(4).type('5');
                cy.get('.timeInput__minutes > input').eq(4).type('50');
            }
            cy.get('button[type=submit]').click();
        });
    };

    const fyllUtArbeidEnkeltdagForArbeidssted = (arbeidssted) => {
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.calendarGrid__day--button').first().should('contain.text', '0 t.');
            cy.get('.calendarGrid__day--button').first().should('contain.text', '0 m.');
            cy.get('.calendarGrid__day--button').first().click();
        });
        cy.get('.tidEnkeltdagDialog').should('exist');
        fyllUtArbeidEnkeltdagForm();
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.calendarGrid__day--button').first().should('contain.text', '2 t.');
            cy.get('.calendarGrid__day--button').first().should('contain.text', '30 m.');
        });
    };

    const fyllUtArbeidPeriodeForArbeidsstedProsent = (arbeidssted) => {
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.knapperad button').click();
        });
        fyllUtArbeidIPeriodeForm(true, '15.11.2021', '19.11.2021');
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.calendarGrid__day--button').eq(6).should('contain.text', '4 t.');
            cy.get('.calendarGrid__day--button').eq(6).should('contain.text', '0 m.');
        });
    };

    const fyllUtArbeidPeriodeForArbeidsstedTimer = (arbeidssted) => {
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.knapperad button').click();
        });
        fyllUtArbeidIPeriodeForm(false, '22.11.2021', '26.11.2021');
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.calendarGrid__day--button').eq(10).should('contain.text', '1 t.');
            cy.get('.calendarGrid__day--button').eq(10).should('contain.text', '10 m.');
            cy.get('.calendarGrid__day--button').eq(11).should('contain.text', '0 t.');
            cy.get('.calendarGrid__day--button').eq(11).should('contain.text', '0 m.');
            cy.get('.calendarGrid__day--button').eq(12).should('contain.text', '3 t.');
            cy.get('.calendarGrid__day--button').eq(12).should('contain.text', '30 m.');
            cy.get('.calendarGrid__day--button').eq(13).should('contain.text', 'uendret');
            cy.get('.calendarGrid__day--button').eq(14).should('contain.text', '5 t.');
            cy.get('.calendarGrid__day--button').eq(14).should('contain.text', '50 m.');
        });
    };

    it('velger å endre arbeidstid', () => {
        cy.visit('http://localhost:8090');
        cy.get('#arbeidstid').parent().click();
        cy.get('.bekreftCheckboksPanel').get('.skjemaelement__label').click();
        cy.get('button[type=submit]').click();
        cy.get('.step__title').should('contain.text', 'Endre arbeidstimer');
    });

    it('inneholder alle arbeidsgivere', () => {
        cy.get('.typo-undertittel').should('contain.text', 'Dykkert svømmeutstyr');
        cy.get('.typo-undertittel').should('contain.text', 'Flaks og fly');
        cy.get('.typo-undertittel').should('contain.text', 'Frilanser');
        cy.get('.typo-undertittel').should('contain.text', 'Selvstendig næringsdrivende');
        cy.get('.ekspanderbartPanel__hode').eq(0).click();
        cy.get('.ekspanderbartPanel__hode').eq(2).click();
        cy.get('.ekspanderbartPanel__hode').eq(4).click();
        cy.get('.ekspanderbartPanel__hode').eq(6).click();
    });
    it('kan endre arbeidstid enkeltdag for arbeidsgivere', () => {
        fyllUtArbeidEnkeltdagForArbeidssted('805824352');
        fyllUtArbeidEnkeltdagForArbeidssted('839942907');
    });
    it('kan endre arbeidstid periode for arbeidsgivere', () => {
        fyllUtArbeidPeriodeForArbeidsstedProsent('805824352');
        fyllUtArbeidPeriodeForArbeidsstedTimer('805824352');
    });
    it('kan endre arbeidstid for frilanser', () => {
        fyllUtArbeidEnkeltdagForArbeidssted('frilanser');
        fyllUtArbeidPeriodeForArbeidsstedProsent('frilanser');
        fyllUtArbeidPeriodeForArbeidsstedTimer('frilanser');
    });
    it('kan endre arbeidstid for sn', () => {
        fyllUtArbeidEnkeltdagForArbeidssted('sn');
        fyllUtArbeidPeriodeForArbeidsstedProsent('sn');
        fyllUtArbeidPeriodeForArbeidsstedTimer('sn');
    });
});
