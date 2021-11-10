import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Knapp from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { K9ArbeidstidInfo } from '../../../types/K9Sak';
import { DagMedTid, TidEnkeltdag } from '../../../types/SoknadFormData';
import { dateToISODate, timeHasSameDuration } from '../../../utils/dateUtils';
import { getDagerMedTidITidsrom, tidErIngenTid } from '../../../utils/tidsbrukUtils';

interface Props {
    periodeIMåned: DateRange;
    tidArbeidstid: TidEnkeltdag;
    arbeidstidArbeidsgiverSak?: K9ArbeidstidInfo;
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
    const { faktisk } = arbeidstidArbeidsgiverSak || { faktisk: {}, normalt: {} };

    const dager = getDagerMedTidITidsrom(tidArbeidstid, periodeIMåned);

    const dagerSak: DagMedTid[] = getDagerMedTidITidsrom(faktisk, periodeIMåned);

    const harEndringer = dager.some((dag) => {
        const key = dateToISODate(dag.dato);
        return timeHasSameDuration(tidArbeidstid[key], faktisk[key]) === false;
    });

    const dagerMedRegistrertArbeidstid = dager.filter((d) => tidErIngenTid(d.tid) === false);

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <span className="--capitalize">
                            {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                                ukeOgÅr: dayjs(periodeIMåned.from).format('MMMM YYYY'),
                            })}
                        </span>
                        {harEndringer && ' (endret)'}
                    </Element>
                    {1 + 1 === 4 && (
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
                    )}
                </>
            }>
            <TidsbrukKalender
                periodeIMåned={periodeIMåned}
                dager={dager}
                utilgjengeligeDatoer={utilgjengeligeDatoer}
                dagerOpprinnelig={dagerSak}
                skjulTommeDagerIListe={true}
                visEndringsinformasjon={true}
            />
            <FormBlock margin="l">
                <Knapp htmlType="button" mini={true} onClick={() => onEdit(tidArbeidstid)}>
                    {dager.length === 0 ? addLabel : editLabel}
                </Knapp>
            </FormBlock>
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMånedInfo;
