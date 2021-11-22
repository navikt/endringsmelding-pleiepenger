import React, { useState } from 'react';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidstidPeriodeDialog from '../../../components/arbeidstid-periode/ArbeidstidPeriodeDialog';
import { ArbeidstidPeriodeData } from '../../../components/arbeidstid-periode/ArbeidstidPeriodeForm';
import { DagerSøktForMap, ISODate } from '../../../types';
import { K9SakMeta } from '../../../types/K9Sak';
import { SoknadFormData, SoknadFormField, TidEnkeltdag, TidFasteDager } from '../../../types/SoknadFormData';
import { getDagerIPeriode } from '../../../components/tid-uker-input/utils';
import { ISODateToDate } from '../../../utils/dateUtils';
import dayjs from 'dayjs';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
// import ArbeidstidEnkeltdagDialog from '../../../components/arbeidstid-enkeltdag/ArbeidstidEnkeltdagDialog';

interface Props {
    formFieldName: SoknadFormField;
    arbeidsstedNavn: string;
    arbeidstidSøknad: TidEnkeltdag;
    endringsperiode: DateRange;
    k9SakMeta: K9SakMeta;
}

/** Returns ISODate array */
export const getDagerDetErSøktForIPeriode = (periode: DateRange, dagerSøktForMap: DagerSøktForMap): ISODate[] => {
    const dagerIPeriode = getDagerIPeriode(periode);
    const dagerIPeriodeDetErSøktFor: ISODate[] = [];
    dagerIPeriode.forEach((dag) => {
        if (dagerSøktForMap[dag.isoDateString] === true) {
            dagerIPeriodeDetErSøktFor.push(dag.isoDateString);
        }
    });
    return dagerIPeriodeDetErSøktFor;
};

const getTidForUkedag = (tid: TidFasteDager, ukedag: number): Time | undefined => {
    switch (ukedag) {
        case 1:
            return tid.mandag;
        case 2:
            return tid.tirsdag;
        case 3:
            return tid.onsdag;
        case 4:
            return tid.torsdag;
        case 5:
            return tid.fredag;
    }
    return undefined;
};

const EndreArbeidstid: React.FunctionComponent<Props> = ({
    k9SakMeta,
    arbeidstidSøknad,
    formFieldName,
    arbeidsstedNavn,
    endringsperiode,
}) => {
    const [visPeriode, setVisPeriode] = useState(false);
    // const [visDag, setVisDag] = useState(false);
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const handleChangePeriode = ({ fom, tom, skalJobbe, tidFasteDager }: ArbeidstidPeriodeData) => {
        const dagerSøktFor = getDagerDetErSøktForIPeriode({ from: fom, to: tom }, k9SakMeta.dagerSøktForMap);
        const dagerSomSkalEndres: TidEnkeltdag = {};
        dagerSøktFor.forEach((isoDate) => {
            if (skalJobbe === false) {
                dagerSomSkalEndres[isoDate] = { hours: '0', minutes: '0' };
            } else if (skalJobbe === true && tidFasteDager) {
                const tid = getTidForUkedag(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
                if (tid) {
                    dagerSomSkalEndres[isoDate] = tid;
                }
            }
        });
        setFieldValue(formFieldName, { ...arbeidstidSøknad, ...dagerSomSkalEndres });
        setVisPeriode(false);
    };

    return (
        <>
            <p style={{ marginTop: '0' }}>
                Du kan endre enkeltdager ved å velge en dato i månedene nedenfor, eller du kan legge til endringer som
                gjelder flere dager ved å velge &quot;Endre periode&quot;-knappen.
            </p>

            <Knapperad align="left">
                <Box margin="none" padBottom="l">
                    <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                        Endre periode
                    </Knapp>
                </Box>
                {/* <Knapp htmlType="button" onClick={() => setVisDag(true)} mini={true}>
                    Endre dag
                </Knapp> */}
            </Knapperad>

            <ArbeidstidPeriodeDialog
                endringsperiode={endringsperiode}
                arbeidsstedNavn={arbeidsstedNavn}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleChangePeriode}
            />

            {/* <ArbeidstidEnkeltdagDialog endringsperiode={endringsperiode} arbeidsstedNavn={arbeidsstedNavn} dagMedTid /> */}
        </>
    );
};

export default EndreArbeidstid;
