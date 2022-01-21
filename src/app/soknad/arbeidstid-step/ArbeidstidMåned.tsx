import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType, ArbeidstidEnkeltdagDialog, TidsbrukKalender } from '@navikt/sif-common-pleiepenger';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import { DateDurationMap, DateRange, dateToISODate, Duration, durationsAreEqual } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import Alertstripe from 'nav-frontend-alertstriper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element } from 'nav-frontend-typografi';

interface Props {
    måned: DateRange;
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    endringsperiode: DateRange;
    dagerSøknad: DateDurationMap;
    dagerSak: DateDurationMap;
    onEnkeltdagChange?: (evt: TidEnkeltdagEndring) => void;
}

const ArbeidstidMåned: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    arbeidsforholdType,
    måned,
    dagerSøknad,
    dagerSak,
    utilgjengeligeDatoer = [],
    månedTittelHeadingLevel = 2,
    endringsperiode,
    onEnkeltdagChange,
}) => {
    const intl = useIntl();
    const [editDate, setEditDate] = useState<{ dato: Date; tid: Duration } | undefined>();

    const harEndringer = Object.keys(dagerSøknad).some((key) => {
        return durationsAreEqual(dagerSak[key], dagerSøknad[key]) === false;
    });

    const harArbeidstidISak = Object.keys(dagerSak).length > 0;
    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={false}
            tittel={
                <Element tag={`h${månedTittelHeadingLevel}`}>
                    <span>
                        {intlHelper(intl, 'arbeidstid.ukeOgÅr', {
                            ukeOgÅr: dayjs(måned.from).format('YYYY - MMMM'),
                        })}
                    </span>
                    {harEndringer && ' (endret)'}
                </Element>
            }>
            {harArbeidstidISak ? (
                <TidsbrukKalender
                    periode={måned}
                    dager={dagerSøknad}
                    dagerOpprinnelig={dagerSak}
                    utilgjengeligeDatoer={utilgjengeligeDatoer}
                    skjulTommeDagerIListe={true}
                    visEndringsinformasjon={true}
                    onDateClick={(dato) => {
                        const tid = dagerSøknad[dateToISODate(dato)];
                        setEditDate({ dato, tid });
                    }}
                />
            ) : (
                <Box margin="l" padBottom="s">
                    <Alertstripe type="info" form="inline">
                        Saken inneholder ikke informasjon om hvor mye du jobber normalt i denne perioden. Du kan da ikke
                        endre arbeidstid for denne perioden.
                    </Alertstripe>
                </Box>
            )}
            {editDate && onEnkeltdagChange && (
                <ArbeidstidEnkeltdagDialog
                    isOpen={editDate !== undefined}
                    formProps={{
                        dato: editDate.dato,
                        tid: editDate.tid,
                        tidOpprinnelig: dagerSak[dateToISODate(editDate.dato)],
                        periode: endringsperiode,
                        onSubmit: (evt) => {
                            onEnkeltdagChange(evt);
                            setEditDate(undefined);
                        },
                        onCancel: () => setEditDate(undefined),
                    }}
                    arbeidsforholdType={arbeidsforholdType}
                    arbeidsstedNavn={arbeidsstedNavn}
                />
            )}
        </Ekspanderbartpanel>
    );
};

export default ArbeidstidMåned;
