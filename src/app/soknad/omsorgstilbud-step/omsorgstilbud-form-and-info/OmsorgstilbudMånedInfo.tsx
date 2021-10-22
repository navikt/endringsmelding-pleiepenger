import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom } from '../../../utils/tidsbrukUtils';
import { timeHasSameDuration } from '../../../utils/dateUtils';

export type OmsorgstilbudIPeriodemånedTittelHeadingLevel = 2 | 3;

interface Props {
    periodeIMåned: DateRange;
    tidOmsorgstilbud: TidEnkeltdag;
    tidOmsorgstilbudSak: TidEnkeltdag;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDager?: Date[];
    månedTittelHeadingLevel?: OmsorgstilbudIPeriodemånedTittelHeadingLevel;
    onEdit: (tid: TidEnkeltdag) => void;
}

const OmsorgstilbudMånedInfo: React.FunctionComponent<Props> = ({
    periodeIMåned,
    tidOmsorgstilbud,
    tidOmsorgstilbudSak,
    editLabel,
    addLabel,
    utilgjengeligeDager,
    månedTittelHeadingLevel = 2,
    onEdit,
}) => {
    const intl = useIntl();
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, periodeIMåned);
    const omsorgsdagerSak = getDagerMedTidITidsrom(tidOmsorgstilbudSak, periodeIMåned);

    const harEndringer = omsorgsdager.some((dag) => {
        const key = dateToISOString(dag.dato);
        return timeHasSameDuration(tidOmsorgstilbud[key], tidOmsorgstilbudSak[key]) === false;
    });

    return (
        <Ekspanderbartpanel
            tittel={
                <>
                    <Undertittel tag={`h${månedTittelHeadingLevel}`}>
                        <span className="--capitalize">
                            {intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
                                ukeOgÅr: dayjs(periodeIMåned.from).format('MMMM YYYY'),
                            })}
                        </span>
                        {harEndringer ? ' (endret)' : ''}
                    </Undertittel>
                    <Box margin="m">
                        <Normaltekst>
                            {omsorgsdager.length === 0 ? (
                                <FormattedMessage id="omsorgstilbud.iPeriodePanel.info.ingenDager" />
                            ) : (
                                <FormattedMessage
                                    id="omsorgstilbud.iPeriodePanel.info"
                                    values={{ dager: omsorgsdager.length }}
                                />
                            )}
                        </Normaltekst>
                    </Box>
                </>
            }>
            <ResponsivePanel style={{ padding: '1rem' }}>
                <TidsbrukKalender
                    tomUkeContentRenderer={() => <p>Det er ikke søkt om pleiepenger for dager i denne uken.</p>}
                    periodeIMåned={periodeIMåned}
                    dager={omsorgsdager}
                    utilgjengeligeDager={utilgjengeligeDager}
                    utilgjengeligDagInfo={'Det er ikke søkt om pleiepenger for denne dagen'}
                    dagerOpprinnelig={omsorgsdagerSak}
                    skjulTommeDagerIListe={true}
                    visEndringsinformasjon={true}
                    tidRenderer={(tid) => {
                        return (
                            <>
                                <strong>
                                    <FormattedTimeText time={tid} decimal={false} />
                                </strong>
                            </>
                        );
                    }}
                />
                <FormBlock margin="l">
                    <Knapp htmlType="button" mini={true} onClick={() => onEdit(tidOmsorgstilbud)}>
                        {omsorgsdager.length === 0 ? addLabel : editLabel}
                    </Knapp>
                </FormBlock>
            </ResponsivePanel>
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudMånedInfo;
