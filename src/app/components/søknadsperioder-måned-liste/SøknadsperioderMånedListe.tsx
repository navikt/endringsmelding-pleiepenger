import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { K9SakMeta } from '../../types/K9Sak';
import { getYearMonthKey } from '../../utils/k9utils';

interface Props {
    k9sakMeta: K9SakMeta;
    inputGroupFieldName: string;
    legend: React.ReactNode;
    description?: React.ReactNode;
    årstallHeadingLevel?: number;
    årstallHeaderRenderer?: (årstall: number) => React.ReactNode;
    månedContentRenderer: (måned: DateRange, søknadsperioderIMåned: DateRange[], index: number) => React.ReactNode;
    onTidChanged?: (tid: TidEnkeltdag) => void;
}

const SøknadsperioderMånedListe: React.FunctionComponent<Props> = ({
    k9sakMeta,
    legend,
    description,
    inputGroupFieldName,
    årstallHeadingLevel: headingLevel = 2,
    årstallHeaderRenderer,
    månedContentRenderer,
}) => {
    const visÅrstallHeading = (index: number): boolean => {
        return (
            k9sakMeta.søknadsperioderGårOverFlereÅr &&
            (index === 0 ||
                k9sakMeta.alleMånederISøknadsperiode[index].from.getFullYear() !==
                    k9sakMeta.alleMånederISøknadsperiode[index - 1].from.getFullYear())
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
            name={`${inputGroupFieldName}_dager` as any}
            legend={legend}
            description={description}
            tag="div"
            // validate={() => validateOmsorgstilbudEnkeltdagerIPeriode(tidIOmsorgstilbud, periode, gjelderFortid)}
        >
            {k9sakMeta.alleMånederISøknadsperiode.map((måned, index) => {
                const søknadsperioderIMåned = k9sakMeta.månederMedSøknadsperiode[getYearMonthKey(måned.from)];
                return søknadsperioderIMåned === undefined ? null : (
                    <FormBlock margin="l" key={dayjs(måned.from).format('MM.YYYY')}>
                        {årstallHeaderRenderer && visÅrstallHeading(index) && (
                            <Box margin="xl" padBottom="l">
                                <Undertittel tag={`h${headingLevel}`} className={'yearHeader'}>
                                    {årstallHeaderRenderer(måned.from.getFullYear())}
                                </Undertittel>
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
