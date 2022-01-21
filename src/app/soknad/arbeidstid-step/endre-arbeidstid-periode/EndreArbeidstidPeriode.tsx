import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import { DateRange } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsforholdType,
    ArbeidstidPeriodeDialog,
    getArbeidstidIPeriodeIntlValues,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    dateToISODate,
    getDatesInDateRange,
    getDurationForISOWeekday,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ArbeidstidPeriodeData } from '../../../components/arbeidstid-periode/ArbeidstidPeriodeForm';
import { DagerSøktForMap, ISODate } from '../../../types';
import { ArbeidstidEnkeltdagSøknad, SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';

interface Props {
    formFieldName: SoknadFormField;
    arbeidsstedNavn: string;
    arbeidstidEnkeltdagSøknad: ArbeidstidEnkeltdagSøknad;
    endringsperiode: DateRange;
    dagerSøktForMap: DagerSøktForMap;
}

/** Returns ISODate array */
export const getDagerDetErSøktForIPeriode = (periode: DateRange, dagerSøktForMap: DagerSøktForMap): ISODate[] => {
    const dates = getDatesInDateRange(periode);
    const dagerIPeriodeDetErSøktFor: ISODate[] = [];
    dates.forEach((date) => {
        const isoDate = dateToISODate(date);
        if (dagerSøktForMap[isoDate] === true) {
            dagerIPeriodeDetErSøktFor.push(isoDate);
        }
    });
    return dagerIPeriodeDetErSøktFor;
};

const EndreArbeidstidPeriode: React.FunctionComponent<Props> = ({
    arbeidstidEnkeltdagSøknad,
    formFieldName,
    arbeidsstedNavn,
    endringsperiode,
    dagerSøktForMap,
}) => {
    const intl = useIntl();
    const [visDialog, setVisDialog] = useState(false);
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const handleChangePeriode = ({ fom, tom, skalJobbe, tidFasteDager }: ArbeidstidPeriodeData) => {
        const dagerSøktFor = getDagerDetErSøktForIPeriode({ from: fom, to: tom }, dagerSøktForMap);
        const dagerSomSkalEndres: DateDurationMap = {};
        dagerSøktFor.forEach((isoDate) => {
            if (skalJobbe === false) {
                dagerSomSkalEndres[isoDate] = { hours: '0', minutes: '0' };
            } else if (skalJobbe === true && tidFasteDager) {
                const tid = getDurationForISOWeekday(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
                if (tid) {
                    dagerSomSkalEndres[isoDate] = tid;
                }
            }
        });
        setFieldValue(formFieldName, { ...arbeidstidEnkeltdagSøknad.faktisk, ...dagerSomSkalEndres });
        setVisDialog(false);
    };

    return (
        <>
            <p style={{ marginTop: '0' }}>
                Du kan endre enkeltdager ved å velge en dato i månedene nedenfor, eller du kan legge til endringer som
                gjelder flere dager ved å velge &quot;Endre periode&quot;-knappen.
            </p>

            <Knapperad align="left">
                <Box margin="none" padBottom="l">
                    <Knapp htmlType="button" onClick={() => setVisDialog(true)} mini={true}>
                        Endre dager i en periode
                    </Knapp>
                </Box>
            </Knapperad>

            <ArbeidstidPeriodeDialog
                isOpen={visDialog}
                formProps={{
                    jobberNormaltTimer: 7,
                    arbeidsstedNavn,
                    intlValues: getArbeidstidIPeriodeIntlValues(intl, {
                        arbeidsforhold: {
                            arbeidsstedNavn,
                            jobberNormaltTimer: 7,
                            type: ArbeidsforholdType.ANSATT,
                        },
                        erHistorisk: false,
                        periode: endringsperiode,
                    }),
                    periode: endringsperiode,
                    onCancel: () => setVisDialog(false),
                    onSubmit: handleChangePeriode,
                }}
            />

            {/* <ArbeidstidPeriodeDialog
                endringsperiode={endringsperiode}
                arbeidsstedNavn={arbeidsstedNavn}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleChangePeriode}
            /> */}

            {/* <ArbeidstidEnkeltdagDialog endringsperiode={endringsperiode} arbeidsstedNavn={arbeidsstedNavn} dagMedTid /> */}
        </>
    );
};

export default EndreArbeidstidPeriode;