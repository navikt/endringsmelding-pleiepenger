import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { K9SakMeta } from '../../types/K9Sak';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { getYearMonthKey } from '../../utils/k9SakUtils';

interface Props {
    k9sakMeta: K9SakMeta;
    fieldset?: {
        inputGroupFieldName: string;
        legend: React.ReactNode;
        description?: React.ReactNode;
        validate?: ValidationFunction<ValidationError>;
    };
    årstallHeadingLevel?: number;
    minDato?: Date;
    årstallHeaderRenderer?: (årstall: number) => React.ReactNode;
    månedContentRenderer: (måned: DateRange, søknadsperioderIMåned: DateRange[], index: number) => React.ReactNode;
    onTidChanged?: (tid: TidEnkeltdag) => void;
}

const SøknadsperioderMånedListe: React.FunctionComponent<Props> = ({
    k9sakMeta,
    fieldset,
    årstallHeadingLevel: headingLevel = 2,
    minDato,
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

    const renderMåned = (måned: DateRange, index: number) => {
        const søknadsperioderIMåned = k9sakMeta.månederMedSøknadsperiodeMap[getYearMonthKey(måned.from)];
        return søknadsperioderIMåned === undefined ? null : (
            <FormBlock margin="none" paddingBottom="m" key={dayjs(måned.from).format('MM.YYYY')}>
                {årstallHeaderRenderer && visÅrstallHeading(index) && (
                    <Box margin="l" padBottom="m">
                        <Undertittel tag={`h${headingLevel}`} className={'yearHeader'}>
                            {årstallHeaderRenderer(måned.from.getFullYear())}
                        </Undertittel>
                    </Box>
                )}
                {månedContentRenderer(måned, søknadsperioderIMåned, index)}
            </FormBlock>
        );
    };
    const renderMåneder = (): JSX.Element => {
        const måneder = minDato
            ? k9sakMeta.alleMånederISøknadsperiode.filter((m) => dayjs(m.from).isSameOrAfter(minDato, 'day'))
            : k9sakMeta.alleMånederISøknadsperiode;

        return <>{måneder.map(renderMåned)}</>;
    };

    return fieldset ? (
        <SoknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${fieldset.inputGroupFieldName}` as any}
            legend={fieldset.legend}
            description={fieldset.description}
            tag="div"
            validate={fieldset.validate}>
            {renderMåneder()}
        </SoknadFormComponents.InputGroup>
    ) : (
        renderMåneder()
    );
};

export default SøknadsperioderMånedListe;
