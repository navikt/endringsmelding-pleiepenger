import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { getDagerMedTidITidsrom } from '../../../utils/tidsbrukUtils';

export type OmsorgstilbudIPeriodemånedTittelHeadingLevel = 2 | 3;

interface Props {
    tidOmsorgstilbud: TidEnkeltdag;
    tidOmsorgstilbudSak: TidEnkeltdag;
    periode: DateRange;
    editLabel: string;
    addLabel: string;
    skjulTommeDagerIListe?: boolean;
    utilgjengeligeDager?: Date[];
    månedTittelHeadingLevel?: OmsorgstilbudIPeriodemånedTittelHeadingLevel;
    onEdit: (tid: TidEnkeltdag) => void;
}

const OmsorgstilbudIPeriode: React.FunctionComponent<Props> = ({
    tidOmsorgstilbud,
    tidOmsorgstilbudSak,
    periode,
    editLabel,
    addLabel,
    skjulTommeDagerIListe,
    utilgjengeligeDager,
    månedTittelHeadingLevel = 2,
    onEdit,
}) => {
    const intl = useIntl();
    const omsorgsdager = getDagerMedTidITidsrom(tidOmsorgstilbud, periode);
    const omsorgsdagerSak = getDagerMedTidITidsrom(tidOmsorgstilbudSak, periode);
    const tittelIdForAriaDescribedBy = `mndTittel_${dayjs(periode.from).format('MM_YYYY')}`;
    const måned = omsorgsdager.length > 0 ? omsorgsdager[0].dato : periode.from;
    const mndTittelPart = intlHelper(intl, 'omsorgstilbud.ukeOgÅr', {
        ukeOgÅr: dayjs(periode.from).format('MMMM YYYY'),
    });

    return (
        <Ekspanderbartpanel
            tittel={
                <>
                    <Undertittel tag={`h${månedTittelHeadingLevel}`}>{mndTittelPart}</Undertittel>
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
                    måned={måned}
                    periode={periode}
                    utilgjengeligeDager={utilgjengeligeDager}
                    utilgjengeligDagInfo={'Det er ikke søkt om pleiepenger for denne dagen'}
                    dager={omsorgsdager}
                    dagerOpprinnelig={omsorgsdagerSak}
                    visSomListe={false}
                    skjulTommeDagerIListe={skjulTommeDagerIListe}
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
                    <Knapp
                        htmlType="button"
                        mini={true}
                        onClick={() => onEdit(tidOmsorgstilbud)}
                        aria-describedby={tittelIdForAriaDescribedBy}>
                        {omsorgsdager.length === 0 ? addLabel : editLabel}
                    </Knapp>
                </FormBlock>
            </ResponsivePanel>
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudIPeriode;
