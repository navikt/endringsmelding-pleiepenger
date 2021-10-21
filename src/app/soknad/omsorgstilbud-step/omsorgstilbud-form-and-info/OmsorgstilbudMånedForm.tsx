import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom, getTidEnkeltdagerInnenforPeriode, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { getTidIOmsorgValidator } from '../../../validation/validateOmsorgstilbudFields';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { timeHasSameDuration } from '../../../utils/dateUtils';

interface Props {
    måned: DateRange;
    tidOmsorgstilbud: TidEnkeltdag;
    tidIOmsorgstilbudSak: TidEnkeltdag;
    utilgjengeligeDager: Date[];
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

const OmsorgstilbudMånedForm: React.FunctionComponent<Props> = ({
    måned,
    tidOmsorgstilbud,
    tidIOmsorgstilbudSak,
    utilgjengeligeDager,
    erHistorisk,
    onSubmit,
    onCancel,
}) => {
    const tidIMåned = getTidEnkeltdagerInnenforPeriode(tidOmsorgstilbud, måned);
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, måned);
    const erEndret = omsorgsdager.some((dag) => {
        const key = dateToISOString(dag.dato);
        return timeHasSameDuration(tidOmsorgstilbud[key], tidIOmsorgstilbudSak[key]) === false;
    });
    return (
        <TidKalenderForm
            periode={måned}
            utilgjengeligeDager={utilgjengeligeDager}
            tid={tidIMåned}
            opprinneligTid={tidIOmsorgstilbudSak}
            erEndret={erEndret}
            tittel={
                <FormattedMessage
                    id="omsorgstilbud.form.tittel"
                    values={{ måned: dayjs(måned.from).format('MMMM YYYY') }}
                />
            }
            intro={
                <>
                    <p>
                        <FormattedMessage
                            id={erHistorisk ? 'omsorgstilbud.form.intro_fortid.1' : 'omsorgstilbud.form.intro.1'}
                        />
                    </p>
                    <p>
                        <strong>
                            <FormattedMessage id="omsorgstilbud.form.intro.2" />
                        </strong>
                    </p>
                </>
            }
            tidPerDagValidator={getTidIOmsorgValidator}
            onSubmit={(values) => {
                onSubmit(
                    cleanupTidIPeriode(
                        tidOmsorgstilbud,
                        values,
                        getTidEnkeltdagerInnenforPeriode(tidIOmsorgstilbudSak, måned)
                    )
                );
            }}
            onCancel={onCancel}
        />
    );
};

export default OmsorgstilbudMånedForm;
