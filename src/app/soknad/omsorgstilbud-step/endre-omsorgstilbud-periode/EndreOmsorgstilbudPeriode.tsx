import React, { useState } from 'react';
import { OmsorgstilbudPeriodeData, OmsorgstilbudPeriodeDialog } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    DateRange,
    dateToISODate,
    getDatesInDateRange,
    getDurationForISOWeekdayNumber,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    periode: DateRange;
    gjelderFortid: boolean;
    onPeriodeChange: (tid: DateDurationMap) => void;
}

const oppdaterDagerMedOmsorgstilbudIPeriode = ({
    fom,
    tom,
    tidFasteDager,
}: OmsorgstilbudPeriodeData): DateDurationMap => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom }, true);
    const dagerSomSkalEndres: DateDurationMap = {};
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        const varighet = getDurationForISOWeekdayNumber(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
        if (varighet) {
            dagerSomSkalEndres[isoDate] = { ...varighet };
        }
    });
    return dagerSomSkalEndres;
};

const EndreOmsorgstilbudPeriode: React.FC<Props> = ({ periode, onPeriodeChange }) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: OmsorgstilbudPeriodeData) => {
        setVisPeriode(false);
        setTimeout(() => {
            onPeriodeChange(oppdaterDagerMedOmsorgstilbudIPeriode(data));
        });
    };

    return (
        <>
            <p style={{ marginTop: '0' }}>
                Du kan endre enkeltdager ved å velge en dato i månedene nedenfor, eller du kan legge til endringer som
                gjelder flere dager ved å velge &quot;Endre periode&quot;-knappen.
            </p>
            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true} name="leggTilPeriode">
                Endre for en periode
            </Knapp>
            <OmsorgstilbudPeriodeDialog
                formProps={{
                    periode,
                    onCancel: () => setVisPeriode(false),
                    onSubmit: handleFormSubmit,
                }}
                isOpen={visPeriode}
            />
        </>
    );
};

export default EndreOmsorgstilbudPeriode;
