import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DurationText, OmsorgstilbudEnkeltdagDialog, TidsbrukKalender } from '@navikt/sif-common-pleiepenger';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import {
    DateDurationMap,
    DateRange,
    dateToISODate,
    Duration,
    durationsAreEqual,
    getDurationsInDateRange,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../../types/Sak';

interface Props {
    periode: DateRange;
    endringsperiode: DateRange;
    tidOmsorgstilbud: DateDurationMap;
    tidOmsorgstilbudSak: TidEnkeltdag;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    onEnkeltdagChange?: (tid: TidEnkeltdagEndring) => void;
}

const OmsorgstilbudMånedInfo: React.FunctionComponent<Props> = ({
    periode,
    tidOmsorgstilbud,
    tidOmsorgstilbudSak,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    endringsperiode,
    onEnkeltdagChange,
}) => {
    const intl = useIntl();
    const [editDate, setEditDate] = useState<{ dato: Date; tid: Duration } | undefined>();

    const omsorgsdager = getDurationsInDateRange(tidOmsorgstilbud, periode);
    const omsorgsdagerSak = getDurationsInDateRange(tidOmsorgstilbudSak, periode);

    const harEndringer = Object.keys(omsorgsdager).some((key) => {
        return durationsAreEqual(tidOmsorgstilbud[key], tidOmsorgstilbudSak[key]) === false;
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={false}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <span className="m-caps">
                            {intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
                                ukeOgÅr: dayjs(periode.from).format('MMMM YYYY'),
                            })}
                        </span>
                        {harEndringer ? ' (endret)' : ''}
                    </Element>
                </>
            }>
            <TidsbrukKalender
                periode={periode}
                dager={omsorgsdager}
                utilgjengeligeDatoer={utilgjengeligeDatoer}
                dagerOpprinnelig={omsorgsdagerSak}
                skjulTommeDagerIListe={true}
                visEndringsinformasjon={true}
                tidRenderer={({ tid }) => {
                    if (tid.hours === '0' && tid.minutes === '0') {
                        return <></>;
                    }
                    return <DurationText duration={tid} />;
                }}
                opprinneligTidRenderer={({ tid }) => {
                    return <DurationText duration={tid} />;
                }}
                onDateClick={(date) => {
                    const tid = omsorgsdager[dateToISODate(date)] || {};
                    setEditDate({ dato: date, tid: tid });
                }}
            />
            {editDate && onEnkeltdagChange && (
                <OmsorgstilbudEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    formProps={{
                        periode: endringsperiode,
                        dato: editDate.dato,
                        tid: editDate.tid,
                        onSubmit: (evt) => {
                            setEditDate(undefined);
                            setTimeout(() => {
                                /** TimeOut pga komponent unmountes */
                                onEnkeltdagChange(evt);
                            });
                        },
                        onCancel: () => setEditDate(undefined),
                    }}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudMånedInfo;
