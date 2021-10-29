import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { DagMedTid, TidEnkeltdag } from '../../../types/SoknadFormData';
import { timeHasSameDuration } from '../../../utils/dateUtils';
import { getDagerMedTidITidsrom, tidErIngenTid } from '../../../utils/tidsbrukUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import { K9ArbeidsgiverArbeidstid } from '../../../types/K9Sak';
import { getEndringsdato } from '../../../utils/endringsperiode';
import { InputTime } from '../../../types';

interface Props {
    periodeIMåned: DateRange;
    tidArbeidstid: TidEnkeltdag;
    arbeidstidArbeidsgiverSak: K9ArbeidsgiverArbeidstid;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    onEdit: (tid: TidEnkeltdag) => void;
}

const ArbeidstidMånedInfo: React.FunctionComponent<Props> = ({
    periodeIMåned,
    tidArbeidstid,
    arbeidstidArbeidsgiverSak,
    editLabel,
    addLabel,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    onEdit,
}) => {
    const intl = useIntl();
    const { faktisk } = arbeidstidArbeidsgiverSak;

    const dager = useMemo(() => getDagerMedTidITidsrom(tidArbeidstid, periodeIMåned), [tidArbeidstid, periodeIMåned]);

    const dagerSak: DagMedTid[] = useMemo(
        () => getDagerMedTidITidsrom(faktisk, periodeIMåned),
        [faktisk, periodeIMåned]
    );

    const harEndringer = useMemo(
        () =>
            dager.some((dag) => {
                const key = dateToISOString(dag.dato);
                return timeHasSameDuration(tidArbeidstid[key], faktisk[key]) === false;
            }),
        [dager, faktisk, tidArbeidstid]
    );

    const dagerMedRegistrertArbeidstid = dager.filter((d) => tidErIngenTid(d.tid) === false);

    const getTidForDag = (dato: Date) => {
        const dag = dager.find((d) => dayjs(d.dato).isSame(dato, 'day'));
        return dag ? dag.tid : undefined;
    };

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
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
                    utilgjengeligeDatoer={utilgjengeligeDatoer}
                    utilgjengeligDagInfo={'Det er ikke søkt om pleiepenger for denne dagen'}
                    dagerOpprinnelig={dagerSak}
                    skjulTommeDagerIListe={true}
                    visEndringsinformasjon={true}
                    popoverContentRenderer={(date) => {
                        const dateKey = dateToISOString(date);
                        const tid: InputTime | undefined = getTidForDag(date);
                        const opprinneligTid: InputTime | undefined = arbeidstidArbeidsgiverSak.faktisk[dateKey];
                        const jobberNormaltTid: InputTime | undefined = arbeidstidArbeidsgiverSak.normalt[dateKey];
                        const erEndret = timeHasSameDuration(tid, opprinneligTid) === false;
                        const erHistorisk = dayjs(date).isBefore(getEndringsdato());
                        return (
                            <div style={{ minWidth: '8rem', textAlign: 'left' }}>
                                <Element>{prettifyDate(date)}</Element>
                                <ul className="clean">
                                    {tid && (
                                        <li>
                                            {erHistorisk ? 'Jobbet' : 'Skal jobbe'}: <FormattedTimeText time={tid} />
                                        </li>
                                    )}
                                    {erEndret && opprinneligTid && (
                                        <li>
                                            Endret fra: <FormattedTimeText time={opprinneligTid} />
                                        </li>
                                    )}
                                    {jobberNormaltTid && (
                                        <li>
                                            {erHistorisk ? 'Jobbet normalt' : 'Jobber normalt'}:{' '}
                                            <FormattedTimeText time={jobberNormaltTid} />
                                        </li>
                                    )}
                                </ul>
                            </div>
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
