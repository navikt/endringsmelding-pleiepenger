import React, { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidstidPeriodeDialog from '../../../components/arbeidstid-periode/ArbeidstidPeriodeDialog';
import { DateRange } from '@navikt/sif-common-formik/lib';

interface Props {
    arbeidsstedNavn: string;
    endringsperiode: DateRange;
}

const EndreArbeidstid: React.FunctionComponent<Props> = ({ arbeidsstedNavn, endringsperiode }) => {
    const [visPeriode, setVisPeriode] = useState(false);

    return (
        <>
            <p style={{ marginTop: '0' }}>
                Du kan endre enkeltdager ved å velge en dato i månedene nedenfor, eller du kan legge til endringer som
                gjelder flere dager ved å velge &quot;Endre periode&quot;-knappen.
            </p>

            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                Endre periode
            </Knapp>

            <ArbeidstidPeriodeDialog
                endringsperiode={endringsperiode}
                arbeidsstedNavn={arbeidsstedNavn}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={() => null}
            />
        </>
    );
};

export default EndreArbeidstid;
