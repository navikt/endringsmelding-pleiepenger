import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType, ArbeidstidEnkeltdagDialog, TidsbrukKalender } from '@navikt/sif-common-pleiepenger';
import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
import { DateDurationMap, DateRange, dateToISODate, Duration, durationsAreEqual } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
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
