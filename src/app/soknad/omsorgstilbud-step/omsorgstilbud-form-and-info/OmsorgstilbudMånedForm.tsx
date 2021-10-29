import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom, getTidEnkeltdagerInnenforPeriode, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { getTidIOmsorgValidator } from '../../../validation/validateOmsorgstilbudFields';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';
import { timeToISODuration } from '../../../utils/timeUtils';

interface Props {
    periodeIMåned: DateRange;
    tidOmsorgstilbud: TidEnkeltdag;
    tidIOmsorgstilbudSak: TidEnkeltdag;
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
        const opprinneligDuration = tidOpprinnelig[key] ? timeToISODuration(tidOpprinnelig[key]) : undefined;
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

const OmsorgstilbudMånedForm: React.FunctionComponent<Props> = ({
    periodeIMåned,
    tidOmsorgstilbud,
    tidIOmsorgstilbudSak,
    utilgjengeligeDatoer,
    erHistorisk,
    onSubmit,
    onCancel,
}) => {
    const tidIMåned = getTidEnkeltdagerInnenforPeriode(tidOmsorgstilbud, periodeIMåned);
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, periodeIMåned);
    const erEndret = omsorgsdager.some((dag) => {
        const key = dateToISODate(dag.dato);
        return timeHasSameDuration(tidOmsorgstilbud[key], tidIOmsorgstilbudSak[key]) === false;
    });
    return (
        <TidKalenderForm
            periode={periodeIMåned}
            utilgjengeligeDatoer={utilgjengeligeDatoer}
            tid={tidIMåned}
            opprinneligTid={tidIOmsorgstilbudSak}
            erEndret={erEndret}
            tittel={
                <FormattedMessage
                    id="omsorgstilbud.form.tittel"
                    values={{ måned: dayjs(periodeIMåned.from).format('MMMM YYYY') }}
                />
            }
            intro={
                <>
                    <p>
                        <FormattedMessage
                            id={erHistorisk ? 'omsorgstilbud.form.intro_fortid.1' : 'omsorgstilbud.form.intro.1'}
                        />
                    </p>
                </>
            }
            tidPerDagValidator={getTidIOmsorgValidator}
            onSubmit={(values) => {
                onSubmit(
                    cleanupTidIPeriode(
                        tidOmsorgstilbud,
                        values,
                        getTidEnkeltdagerInnenforPeriode(tidIOmsorgstilbudSak, periodeIMåned)
                    )
                );
            }}
            onCancel={onCancel}
        />
    );
};

export default OmsorgstilbudMånedForm;
