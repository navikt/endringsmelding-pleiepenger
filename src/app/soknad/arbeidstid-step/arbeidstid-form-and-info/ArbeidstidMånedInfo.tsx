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
import { getDagerMedTidITidsrom, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { timeHasSameDuration } from '../../../utils/dateUtils';

export type ArbeidstidIPeriodemånedTittelHeadingLevel = 2 | 3;

interface Props {
    periodeIMåned: DateRange;
    tidArbeidstid: TidEnkeltdag;
    tidArbeidstidSak: TidEnkeltdag;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDager?: Date[];
    månedTittelHeadingLevel?: ArbeidstidIPeriodemånedTittelHeadingLevel;
    onEdit: (tid: TidEnkeltdag) => void;
}

const ArbeidstidMånedInfo: React.FunctionComponent<Props> = ({
    periodeIMåned,
    tidArbeidstid,
    tidArbeidstidSak,
    editLabel,
    addLabel,
    utilgjengeligeDager,
    månedTittelHeadingLevel = 2,
    onEdit,
}) => {
    const intl = useIntl();
    const dager = getDagerMedTidITidsrom(tidArbeidstid, periodeIMåned);
    const dagerSak = getDagerMedTidITidsrom(tidArbeidstidSak, periodeIMåned);

    const harEndringer = dager.some((dag) => {
        const key = dateToISOString(dag.dato);
        return timeHasSameDuration(tidArbeidstid[key], tidArbeidstidSak[key]) === false;
    });

    const dagerMedRegistrertArbeidstid = dager.filter((d) => tidErIngenTid(d.tid) === false);

    return (
        <Ekspanderbartpanel
            tittel={
                <>
                    <Undertittel tag={`h${månedTittelHeadingLevel}`}>
                        <span className="--capitalize">
                            {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                                ukeOgÅr: dayjs(periodeIMåned.from).format('MMMM YYYY'),
                            })}
                        </span>
                        {harEndringer ? ' (endret)' : ''}
                    </Undertittel>
                    <Box margin="m">
                        <Normaltekst>
                            {dagerMedRegistrertArbeidstid.length === 0 ? (
                                <FormattedMessage id="arbeidstid.iPeriodePanel.info.ingenDager" />
                            ) : (
                                <FormattedMessage
                                    id="arbeidstid.iPeriodePanel.info"
                                    values={{ dager: dagerMedRegistrertArbeidstid.length }}
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
                    dager={dager}
                    utilgjengeligeDager={utilgjengeligeDager}
                    utilgjengeligDagInfo={'Det er ikke søkt om pleiepenger for denne dagen'}
                    dagerOpprinnelig={dagerSak}
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
                    <Knapp htmlType="button" mini={true} onClick={() => onEdit(tidArbeidstid)}>
                        {dager.length === 0 ? addLabel : editLabel}
                    </Knapp>
                </FormBlock>
            </ResponsivePanel>
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
