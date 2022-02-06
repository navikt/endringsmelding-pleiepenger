describe('Generell flyt', () => {
    const fyllUtEnkeltdag = () => {
        cy.get('.tidEnkeltdagDialog').within(() => {
            cy.get('.timeInput__hours').children('input').type('{selectall}').type('2');
            cy.get('.timeInput__minutes').children('input').type('{selectall}').type('30');
            cy.get('button[type=submit]').click();
        });
    };

    const fyllUtPeriode = (brukProsent) => {
        cy.get('.arbeidstidPeriodeDialog').within(() => {
            cy.get('input[type=text]').eq(0).type('{selectall}').type('15.11.2021').blur();
            cy.get('input[type=text]').eq(1).type('{selectall}').type('26.11.2021').blur();
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
    const fyllUtArbeidstidForArbeidssted = (arbeidssted, brukProsent) => {
        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.ekspanderbartPanel__hode').first().click();
            cy.get('.calendarGrid__day--button').first().should('contain.text', '0 t.');
            cy.get('.calendarGrid__day--button').first().should('contain.text', '0 m.');
            cy.get('.calendarGrid__day--button').first().click();
        });
        cy.get('.tidEnkeltdagDialog').should('exist');
        fyllUtEnkeltdag();
        cy.get('.calendarGrid__day--button').first().should('contain.text', '2 t.');
        cy.get('.calendarGrid__day--button').first().should('contain.text', '30 m.');

        cy.get(`#arbeidsted-${arbeidssted}`).within(() => {
            cy.get('.knapperad button').click();
        });
        fyllUtPeriode();
    };

    it('siden lastes ok', () => {
        cy.visit('http://localhost:8090');
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
    it('inneholder alle arbeidsgivere', () => {
        cy.get('.typo-undertittel').should('contain.text', 'Dykkert svømmeutstyr');
        cy.get('.typo-undertittel').should('contain.text', 'Flaks og fly');
        cy.get('.typo-undertittel').should('contain.text', 'Frilanser');
        cy.get('.typo-undertittel').should('contain.text', 'Selvstendig næringsdrivende');
    });
    it('kan endre arbeidstid for alle arbeidsgivere', () => {
        fyllUtArbeidstidForArbeidssted('839942907', true);
        fyllUtArbeidstidForArbeidssted('805824352', false);
        fyllUtArbeidstidForArbeidssted('frilanser', false);
        fyllUtArbeidstidForArbeidssted('sn', true);
    });

    // it('kan gå videre til omsorgstilbud', () => {
    //     cy.get('button[type=submit]').click();
    //     cy.get('.step__title').should('contain.text', 'Endre tid i omsorgstilbud');
    // });
});
