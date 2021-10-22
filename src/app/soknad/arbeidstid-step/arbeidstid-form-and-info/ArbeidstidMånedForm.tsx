import React from 'react';
import { FormattedMessage } from 'react-intl';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import TidKalenderForm from '../../../components/tid-kalender-form/TidKalenderForm';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { timeHasSameDuration } from '../../../utils/dateUtils';
import { getDagerMedTidITidsrom, getTidEnkeltdagerInnenforPeriode, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { getArbeidstidValidator } from '../../../validation/validateArbeidstidFields';

interface Props {
    periodeIMåned: DateRange;
    arbeidstid: TidEnkeltdag;
    arbeidstidSak: TidEnkeltdag;
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

const ArbeidstidMånedForm: React.FunctionComponent<Props> = ({
    periodeIMåned,
    arbeidstid: tidArbeidstid,
    arbeidstidSak,
    utilgjengeligeDager,
    erHistorisk,
    onSubmit,
    onCancel,
}) => {
    const tidIMåned = getTidEnkeltdagerInnenforPeriode(tidArbeidstid, periodeIMåned);
    const dager = getDagerMedTidITidsrom(tidArbeidstid, periodeIMåned);
    const erEndret = dager.some((dag) => {
        const key = dateToISOString(dag.dato);
        return timeHasSameDuration(tidArbeidstid[key], arbeidstidSak[key]) === false;
    });
    return (
        <TidKalenderForm
            periode={periodeIMåned}
            utilgjengeligeDager={utilgjengeligeDager}
            tid={tidIMåned}
            opprinneligTid={arbeidstidSak}
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
                    <p>
                        <strong>
                            <FormattedMessage id="omsorgstilbud.form.intro.2" />
                        </strong>
                    </p>
                </>
            }
            tidPerDagValidator={getArbeidstidValidator}
            onSubmit={(values) => {
                onSubmit(
                    cleanupTidIPeriode(
                        tidArbeidstid,
                        values,
                        getTidEnkeltdagerInnenforPeriode(arbeidstidSak, periodeIMåned)
                    )
                );
            }}
            onCancel={onCancel}
        />
    );
};

export default ArbeidstidMånedForm;
