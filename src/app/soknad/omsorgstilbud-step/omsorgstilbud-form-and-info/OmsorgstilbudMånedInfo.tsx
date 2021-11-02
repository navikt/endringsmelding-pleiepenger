import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender, { TidRenderer } from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom } from '../../../utils/tidsbrukUtils';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';

interface Props {
    periodeIMåned: DateRange;
    tidOmsorgstilbud: TidEnkeltdag;
    tidOmsorgstilbudSak: TidEnkeltdag;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
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
    onEdit,
}) => {
    const intl = useIntl();
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, periodeIMåned);
    const omsorgsdagerSak = getDagerMedTidITidsrom(tidOmsorgstilbudSak, periodeIMåned);

    const harEndringer = omsorgsdager.some((dag) => {
        const key = dateToISODate(dag.dato);
        return timeHasSameDuration(tidOmsorgstilbud[key], tidOmsorgstilbudSak[key]) === false;
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
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
                    {/* <Box margin="m">
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
                    </Box> */}
                </>
            }>
            <ResponsivePanel style={{ padding: '1rem' }}>
                <TidsbrukKalender
                    periodeIMåned={periodeIMåned}
                    dager={omsorgsdager}
                    utilgjengeligeDatoer={utilgjengeligeDatoer}
                    dagerOpprinnelig={omsorgsdagerSak}
                    skjulTommeDagerIListe={true}
                    visEndringsinformasjon={true}
                    tidRenderer={tidRenderer}
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
