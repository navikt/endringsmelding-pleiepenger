import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsforholdType,
    ArbeidstidPeriodeData,
    ArbeidstidPeriodeDialog,
    getArbeidstidIPeriodeIntlValues,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    DateRange,
    dateToISODate,
    decimalDurationToDuration,
    Duration,
    durationToDecimalDuration,
    getDatesInDateRange,
    getDurationForISOWeekday,
    ISODate,
    ISODateToDate,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { DagerSøktForMap } from '../../../types';
import { ArbeidstidEnkeltdagSøknad, SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';

interface Props {
    formFieldName: SoknadFormField;
    arbeidsstedNavn: string;
    arbeidstidEnkeltdagSøknad: ArbeidstidEnkeltdagSøknad;
    endringsperiode: DateRange;
    dagerSøktForMap: DagerSøktForMap;
    onArbeidstidChanged?: () => void;
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

const getNyArbeidstidUtFraProsent = (prosent: number, normalArbeidstid: Duration): Duration => {
    const nyArbeidstidUtFraProsent = (durationToDecimalDuration(normalArbeidstid) / 100) * prosent;
    return decimalDurationToDuration(nyArbeidstidUtFraProsent);
};

const EndreArbeidstidPeriode: React.FunctionComponent<Props> = ({
    arbeidstidEnkeltdagSøknad,
    formFieldName,
    arbeidsstedNavn,
    endringsperiode,
    dagerSøktForMap,
    onArbeidstidChanged,
}) => {
    const intl = useIntl();
    const [visDialog, setVisDialog] = useState(false);
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const handleChangePeriode = ({ fom, tom, tidFasteDager, prosent }: ArbeidstidPeriodeData) => {
        const dagerSøktFor = getDagerDetErSøktForIPeriode({ from: fom, to: tom }, dagerSøktForMap);
        const dagerSomSkalEndres: DateDurationMap = {};
        dagerSøktFor.forEach((isoDate) => {
            if (tidFasteDager) {
                const tid = getDurationForISOWeekday(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
                if (tid) {
                    dagerSomSkalEndres[isoDate] = tid;
                }
            }
            const pst = getNumberFromNumberInputValue(prosent);
            if (pst && isNaN(pst) === false) {
                const normalarbeidstid = arbeidstidEnkeltdagSøknad.normalt[isoDate];
                if (normalarbeidstid) {
                    dagerSomSkalEndres[isoDate] = getNyArbeidstidUtFraProsent(pst, normalarbeidstid);
                }
            }
        });
        setFieldValue(formFieldName, { ...arbeidstidEnkeltdagSøknad.faktisk, ...dagerSomSkalEndres });
        setVisDialog(false);
        if (onArbeidstidChanged) {
            onArbeidstidChanged();
        }
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
                    arbeidsstedNavn,
                    intlValues: getArbeidstidIPeriodeIntlValues(intl, {
                        arbeidsforhold: {
                            arbeidsstedNavn,
                            jobberNormaltTimer: undefined,
                            type: ArbeidsforholdType.ANSATT,
                        },
                        periode: endringsperiode,
                    }),
                    periode: endringsperiode,
                    onCancel: () => setVisDialog(false),
                    onSubmit: handleChangePeriode,
                }}
            />
        </>
    );
};

export default EndreArbeidstidPeriode;
