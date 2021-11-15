const omsorgstilbudMessages = {
    nb: {
        'omsorgstilbud.validation.hoursAreInvalid': 'Antall timer {dag} er ikke et gyldig tall.',
        'omsorgstilbud.validation.minutesAreInvalid': 'Antall minutter {dag} er ikke et gyldig tall.',
        'omsorgstilbud.validation.tooManyHours': 'Antall timer {dag} er for høyt. Maks antall timer er {maksTimer}.',
        'omsorgstilbud.validation.tooManyMinutes': 'Antall minutter {dag} er for høyt. Maks antall minutter er 59.',
        'omsorgstilbud.validation.durationIsTooLong':
            'Antall timer og minutter {dag} er for høyt. Tiden kan ikke være mer enn 7 timer og 30 minutter.',
        'omsorgstilbud.validation.durationIsTooShort':
            'Antall timer og minutter {dag} er for lavt. Tiden må være minst ett minutt.',
        'omsorgstilbud.uke': 'Uke {uke}',
        'omsorgstilbud.ukeOgÅr': '{ukeOgÅr}',
        'omsorgstilbud.ingenDagerRegistrert': 'Ingen dager med omsorgstilbud registrert',
        'omsorgstilbud.form.tittel': 'Omsorgstilbud - {måned}',
        'omsorgstilbud.form.intro.1':
            'Legg inn endringene du ønsker å gjøre i omsorgstilbud. Det er bare dager du har søkt om som er tilgjengelige for endring. Du kan registrere opp til 7 timer og 30 minutter per dag.',
        'omsorgstilbud.ukeForm.tittel': 'Uke {uke}, {år}',

        'omsorgstilbud.svar.ja': 'Ja',
        'omsorgstilbud.svar.nei': 'Nei',

        'omsorgstilbud.timerPerDag.timerOgMinutter': '{hours}t {minutes}m',
        'omsorgstilbud.timerPerDag.timer': '{hours}t',
        'omsorgstilbud.timerPerDag.minutter': '{minutes}m',
        'omsorgstilbud.ingenDagerValgt': 'Ingen dager med tilsyn er registrert',

        'omsorgstilbud.addLabel': 'Registrer tid i omsorgstilbud {periode}',
        'omsorgstilbud.deleteLabel': 'Fjern alle timer',
        'omsorgstilbud.editLabel': 'Endre tid i omsorgstilbud {periode}',
        'omsorgstilbud.modalTitle': 'Omsorgstilbud - {periode}',

        'omsorgstilbud.iPeriodePanel.info':
            '{dager, plural, one {# dag} other {# dager}} med tid i omsorgstilbud registrert.',
        'omsorgstilbud.iPeriodePanel.info.ingenDager': 'Ingen dager med tid i omsorgstilbud registrert.',
    },
};

export default omsorgstilbudMessages;
