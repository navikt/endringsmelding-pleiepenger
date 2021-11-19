import React from 'react';
import { useMediaQuery } from 'react-responsive';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import { TidEnkeltdag } from '../../types/SoknadFormData';
import { TidPerDagValidator } from '../../validation/fieldValidations';
import TidUkeInput from './parts/TidUkeInput';
import { Ukeinfo } from './types';
import { getDagerIPeriode, getTidKalenderFieldName, getUkerFraDager } from './utils';
import './tidUkerInput.less';
import dayjs from 'dayjs';
import { isDateInDates } from '../../utils/dateUtils';

interface Props {
    fieldName: string;
    periode: DateRange;
    brukPanel?: boolean;
    opprinneligTid?: TidEnkeltdag;
    utilgjengeligeDatoer?: Date[];
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    tidPerDagValidator?: TidPerDagValidator;
}

const bem = bemUtils('tidUkerInput');

export const TidUkerInput: React.FunctionComponent<Props> = ({
    fieldName,
    periode,
    brukPanel,
    opprinneligTid,
    utilgjengeligeDatoer,
    ukeTittelRenderer,
    tidPerDagValidator,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });

    const månedDateRange: DateRange = {
        from: dayjs(periode.from).startOf('month').toDate(),
        to: dayjs(periode.to).endOf('month').toDate(),
    };
    const alleDagerIMåned = getDagerIPeriode(månedDateRange);

    const uker = getUkerFraDager(alleDagerIMåned).filter(
        (uke) => uke.dager.filter((dag) => isDateInDates(dag.dato, utilgjengeligeDatoer)).length !== uke.dager.length
    );

    return (
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((uke) => {
                const content = (
                    <TidUkeInput
                        ukeTittelRenderer={ukeTittelRenderer}
                        getFieldName={(dag) => getTidKalenderFieldName(fieldName, dag)}
                        ukeinfo={uke}
                        opprinneligTid={opprinneligTid}
                        utilgjengeligeDatoer={utilgjengeligeDatoer}
                        isNarrow={isNarrow}
                        isWide={isWide}
                        visSomListe={true}
                        tidPerDagValidator={tidPerDagValidator}
                    />
                );
                return (
                    <div key={uke.ukenummer} className={bem.element('ukeWrapper')}>
                        {brukPanel ? <ResponsivePanel>{content}</ResponsivePanel> : content}
                    </div>
                );
            })}
        </div>
    );
};

export default TidUkerInput;
