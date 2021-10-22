import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import flatten from 'lodash.flatten';
import { Undertittel } from 'nav-frontend-typografi';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { getDateRangeFromDateRanges, getMonthsInDateRange, getYearsInDateRanges } from '../../utils/dateUtils';

interface Props {
    inputGroupFieldName: string;
    endringsdato: Date;
    søknadsperioder: DateRange[];
    legend: React.ReactNode;
    description?: React.ReactNode;
    årstallHeaderRenderer?: (årstall: number) => React.ReactNode;
    månedContentRenderer: (måned: DateRange, søknadsperioderIMåned: DateRange[], index: number) => React.ReactNode;
    onTidChanged?: (tid: TidEnkeltdag) => void;
}

type SøknadsperiodeMåned = {
    [yearMonthKey: string]: DateRange[];
};

export const getMånederMedSøknadsperioder = (søknadsperioder: DateRange[]): SøknadsperiodeMåned => {
    const måneder: SøknadsperiodeMåned = {};
    flatten(søknadsperioder.map((periode) => getMonthsInDateRange(periode))).forEach((periode) => {
        const key = getYearMonthKey(periode.from);
        måneder[key] = måneder[key] ? [...måneder[key], periode] : [periode];
    });
    return måneder;
};

const getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');

const SøknadsperioderMånedListe: React.FunctionComponent<Props> = ({
    søknadsperioder,
    legend,
    description,
    inputGroupFieldName: formFieldName,
    årstallHeaderRenderer,
    månedContentRenderer,
}) => {
    const månederMedSøknadsperiode: SøknadsperiodeMåned = getMånederMedSøknadsperioder(søknadsperioder);
    const alleMånederIPeriode = getMonthsInDateRange(getDateRangeFromDateRanges(søknadsperioder));
    const gårOverFlereÅr = getYearsInDateRanges(alleMånederIPeriode).length > 1;

    const visÅrstallHeading = (index: number): boolean => {
        return (
            gårOverFlereÅr &&
            (index === 0 ||
                alleMånederIPeriode[index].from.getFullYear() !== alleMånederIPeriode[index - 1].from.getFullYear())
        );
    };

    return (
        <SoknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${formFieldName}_dager` as any}
            legend={legend}
            description={description}
            tag="div"
            // validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}
        >
            {alleMånederIPeriode.map((måned, index) => {
                const søknadsperioderIMåned = månederMedSøknadsperiode[getYearMonthKey(måned.from)];
                return søknadsperioderIMåned === undefined ? null : (
                    <FormBlock margin="l" key={dayjs(måned.from).format('MM.YYYY')}>
                        {årstallHeaderRenderer && visÅrstallHeading(index) && (
                            <Box margin="xl" padBottom="l">
                                <Undertittel>{årstallHeaderRenderer(måned.from.getFullYear())}</Undertittel>
                            </Box>
                        )}
                        {månedContentRenderer(måned, søknadsperioderIMåned, index)}
                    </FormBlock>
                );
            })}
        </SoknadFormComponents.InputGroup>
    );
};

export default SøknadsperioderMånedListe;
