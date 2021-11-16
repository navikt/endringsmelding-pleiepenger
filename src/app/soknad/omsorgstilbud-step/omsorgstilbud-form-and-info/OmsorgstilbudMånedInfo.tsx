import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender, { TidRenderer } from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { DagMedTid, TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom } from '../../../utils/tidsbrukUtils';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';
import { InputTime } from '../../../types';
import OmsorgstilbudEnkeltdagEdit from '../../../components/omsorgstilbud-enkeltdag-edit/OmsorgstilbudEnkeltdagDialog';
import { K9TidEnkeltdag } from '../../../types/K9Sak';

interface Props {
    periodeIMåned: DateRange;
    tidOmsorgstilbud: TidEnkeltdag;
    tidOmsorgstilbudSak: K9TidEnkeltdag;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    onEnkeltdagChange?: (tid: DagMedTid) => void;
    onEdit: (tid: TidEnkeltdag) => void;
}

const tidRenderer: TidRenderer = (timeInput): React.ReactNode => <FormattedTimeText time={timeInput} />;

const OmsorgstilbudMånedInfo: React.FunctionComponent<Props> = ({
    periodeIMåned,
    tidOmsorgstilbud,
    tidOmsorgstilbudSak,
    editLabel,
    addLabel,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    onEnkeltdagChange,
    onEdit,
}) => {
    const intl = useIntl();
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, periodeIMåned);
    const omsorgsdagerSak = getDagerMedTidITidsrom(tidOmsorgstilbudSak, periodeIMåned);

    const [editDate, setEditDate] = useState<{ dato: Date; tid: InputTime } | undefined>();

    const harEndringer = omsorgsdager.some((dag) => {
        const key = dateToISODate(dag.dato);
        return timeHasSameDuration(tidOmsorgstilbud[key], tidOmsorgstilbudSak[key]) === false;
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={true}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <span className="--capitalize">
                            {intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
                                ukeOgÅr: dayjs(periodeIMåned.from).format('MMMM YYYY'),
                            })}
                        </span>
                        {harEndringer ? ' (endret)' : ''}
                    </Element>
                </>
            }>
            <TidsbrukKalender
                periodeIMåned={periodeIMåned}
                dager={omsorgsdager}
                utilgjengeligeDatoer={utilgjengeligeDatoer}
                dagerOpprinnelig={omsorgsdagerSak}
                skjulTommeDagerIListe={true}
                visEndringsinformasjon={true}
                tidRenderer={tidRenderer}
                onDateClick={(date) => {
                    const dagMedTid = omsorgsdager.find((d) => dayjs(d.dato).isSame(date, 'day'));
                    if (dagMedTid) {
                        setEditDate(dagMedTid);
                    }
                }}
            />
            <FormBlock margin="l">
                <Knapp htmlType="button" mini={true} onClick={() => onEdit(tidOmsorgstilbud)}>
                    {omsorgsdager.length === 0 ? addLabel : editLabel}
                </Knapp>
            </FormBlock>
            {editDate && onEnkeltdagChange && (
                <OmsorgstilbudEnkeltdagEdit
                    dagMedTid={editDate}
                    tidOpprinnelig={tidOmsorgstilbudSak[dateToISODate(editDate.dato)]}
                    onSubmit={(dagMedTid) => {
                        onEnkeltdagChange(dagMedTid);
                        setEditDate(undefined);
                    }}
                    onCancel={() => setEditDate(undefined)}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudMånedInfo;
