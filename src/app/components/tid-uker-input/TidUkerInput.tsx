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

interface Props {
    fieldName: string;
    periode: DateRange;
    brukPanel?: boolean;
    opprinneligTid?: TidEnkeltdag;
    utilgjengeligeDager?: Date[];
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    tidPerDagValidator?: TidPerDagValidator;
}

const bem = bemUtils('tidUkerInput');

export const TidUkerInput: React.FunctionComponent<Props> = ({
    fieldName,
    periode,
    brukPanel,
    opprinneligTid,
    utilgjengeligeDager,
    ukeTittelRenderer,
    tidPerDagValidator,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    // const dager = getDagerIPeriode(periode.from, periode.to);

    const månedDateRange: DateRange = {
        from: dayjs(periode.from).startOf('month').toDate(),
        to: dayjs(periode.to).endOf('month').toDate(),
    };
    const alleDagerIMåned = getDagerIPeriode(månedDateRange.from, månedDateRange.to);

    const uker = getUkerFraDager(alleDagerIMåned);

    return (
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((week) => {
                const content = (
                    <TidUkeInput
                        ukeTittelRenderer={ukeTittelRenderer}
                        getFieldName={(dag) => getTidKalenderFieldName(fieldName, dag)}
                        ukeinfo={week}
                        opprinneligTid={opprinneligTid}
                        utilgjengeligeDager={utilgjengeligeDager}
                        isNarrow={isNarrow}
                        isWide={isWide}
                        tidPerDagValidator={tidPerDagValidator}
                    />
                );
                return (
                    <div key={week.ukenummer} className={bem.element('ukeWrapper')}>
                        {brukPanel ? <ResponsivePanel>{content}</ResponsivePanel> : content}
                    </div>
                );
            })}
        </div>
    );
};

export default TidUkerInput;
