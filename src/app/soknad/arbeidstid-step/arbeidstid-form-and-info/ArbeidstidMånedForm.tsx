import React from 'react';
import { FormattedMessage } from 'react-intl';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';
import { getDagerMedTidITidsrom, getTidEnkeltdagerInnenforPeriode, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { getArbeidstidValidator } from '../../../validation/validateArbeidstidFields';
import { K9ArbeidsgiverArbeidstid } from '../../../types/K9Sak';

interface Props {
    periodeIMåned: DateRange;
    arbeidstid: TidEnkeltdag;
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
    utilgjengeligeDatoer: Date[];
    erHistorisk: boolean;
    onCancel: () => void;
    onSubmit: (tid: TidEnkeltdag) => void;
}

const cleanupTidIPeriode = (
    alleTider: TidEnkeltdag,
    tidIPeriode: TidEnkeltdag,
    tidOpprinnelig: TidEnkeltdag
): TidEnkeltdag => {
    const keysToRemove: string[] = [];
    Object.keys(tidIPeriode).forEach((key) => {
        const opprinneligDuration = tidOpprinnelig[key] ? timeToIso8601Duration(tidOpprinnelig[key]) : undefined;
        if (tidErIngenTid(tidIPeriode[key]) && opprinneligDuration === undefined) {
            keysToRemove.push(key);
        }
    });
    const cleanedTid = { ...alleTider, ...tidIPeriode };
    keysToRemove.forEach((key) => {
        delete cleanedTid[key];
    });
    return cleanedTid;
};

const ArbeidstidMånedForm: React.FunctionComponent<Props> = ({
    periodeIMåned,
    arbeidstid,
    arbeidstidArbeidsgiverSak,
    utilgjengeligeDatoer,
    erHistorisk,
    onSubmit,
    onCancel,
}) => {
    const tidIMåned = getTidEnkeltdagerInnenforPeriode(arbeidstid, periodeIMåned);
    const dager = getDagerMedTidITidsrom(arbeidstid, periodeIMåned);
    const erEndret = dager.some((dag) => {
        const key = dateToISODate(dag.dato);
        return timeHasSameDuration(arbeidstid[key], arbeidstidArbeidsgiverSak.faktisk[key]) === false;
    });
    return (
        <TidKalenderForm
            periode={periodeIMåned}
            utilgjengeligeDatoer={utilgjengeligeDatoer}
            tid={tidIMåned}
            opprinneligTid={arbeidstidArbeidsgiverSak.faktisk}
            erEndret={erEndret}
            tittel={
                <FormattedMessage
                    id="arbeidstid.form.tittel"
                    values={{ måned: dayjs(periodeIMåned.from).format('MMMM YYYY') }}
                />
            }
            intro={
                <>
                    <p>
                        <FormattedMessage
                            id={erHistorisk ? 'arbeidstid.form.intro_fortid.1' : 'arbeidstid.form.intro.1'}
                        />
                    </p>
                </>
            }
            tidPerDagValidator={getArbeidstidValidator}
            onSubmit={(values) => {
                onSubmit(
                    cleanupTidIPeriode(
                        arbeidstid,
                        values,
                        getTidEnkeltdagerInnenforPeriode(arbeidstidArbeidsgiverSak.faktisk, periodeIMåned)
                    )
                );
            }}
            onCancel={onCancel}
        />
    );
};

export default ArbeidstidMånedForm;
