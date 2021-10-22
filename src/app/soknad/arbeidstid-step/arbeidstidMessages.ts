const arbeidstidMessages = {
    nb: {
        'arbeidstid.validation.hoursAreInvalid': 'Antall timer {dag} er ikke et gyldig tall.',
        'arbeidstid.validation.minutesAreInvalid': 'Antall minutter {dag} er ikke et gyldig tall.',
        'arbeidstid.validation.tooManyHours': 'Antall timer {dag} er for høyt. Maks antall timer er {maksTimer}.',
        'arbeidstid.validation.tooManyMinutes': 'Antall minutter {dag} er for høyt. Maks antall minutter er 59.',
        'arbeidstid.validation.durationIsTooLong':
            'Antall timer og minutter {dag} er for høyt. Tiden kan ikke være mer enn 24.',
        'arbeidstid.validation.durationIsTooShort':
            'Antall timer og minutter {dag} er for lavt. Tiden må være minst ett minutt.',
        'arbeidstid.uke': 'Uke {uke}',
        'arbeidstid.ukeOgÅr': '{ukeOgÅr}',
        'arbeidstid.form.tittel': 'Arbeidstid - {måned}',
        'arbeidstid.ukeForm.tittel': 'Uke {uke}, {år}',
        'arbeidstid.form.intro.1':
            'Fyll ut antall timer og minutter du skal jobbe. Du skal bare fylle ut den tiden du vet med sikkerhet. Du trenger ikke fylle ut noe de dagene du ikke skal jobbe. Husk å trykke lagre når du er ferdig med å fylle ut.',
        'arbeidstid.form.intro_fortid.1':
            'Fyll ut antall timer og minutter de dagene du jobbet. Du trenger ikke fylle ut noe de dagene du ikke jobbet. Husk å trykke lagre når du er ferdig med å fylle ut.',

        'arbeidstid.svar.ja': 'Ja',
        'arbeidstid.svar.nei': 'Nei',

        'arbeidstid.timerPerDag.timerOgMinutter': '{hours}t {minutes}m',
        'arbeidstid.timerPerDag.timer': '{hours}t',
        'arbeidstid.timerPerDag.minutter': '{minutes}m',

        'arbeidstid.addLabel': 'Registrer hvor mye du jobbet {periode}',
        'arbeidstid.deleteLabel': 'Fjern alle timer',
        'arbeidstid.editLabel': 'Endre arbeidstid {periode}',
        'arbeidstid.modalTitle': 'Arbeidstid - {periode}',
        'arbeidstid.iPeriodePanel.info': '{dager, plural, one {# dag} other {# dager}} med jobb registrert.',
        'arbeidstid.iPeriodePanel.info.ingenDager': 'Ingen dager jobb registrert.',
    },
};

export default arbeidstidMessages;
