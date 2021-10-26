import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikTimeInput } from '@navikt/sif-common-formik';
import { Element } from 'nav-frontend-typografi';
import { TidEnkeltdag } from '../../../types/SoknadFormData';
import { isDateInDates } from '../../../utils/dateUtils';
import { TidPerDagValidator } from '../../../validation/fieldValidations';
import { Daginfo, Ukeinfo } from '../types';
import { getForegåendeDagerIUke } from '../utils';

type DagLabelRenderer = (dag: Daginfo) => React.ReactNode;

interface Props {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    opprinneligTid?: TidEnkeltdag;
    isNarrow: boolean;
    isWide: boolean;
    utilgjengeligeDatoer?: Date[];
    visSomListe?: boolean;
    tidPerDagValidator?: TidPerDagValidator;
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    dagLabelRenderer?: (dag: Daginfo) => React.ReactNode;
}

const renderDagLabel = (dag: Daginfo, customRenderer?: DagLabelRenderer): JSX.Element => {
    return (
        <span className={bem.element('dag__label')}>
            {customRenderer ? (
                customRenderer(dag)
            ) : (
                <>
                    <span className={bem.element('dag__label__dagnavn')}>{dag.labelDag}</span>
                    <span className={bem.element('dag__label__dato')}>{dag.labelDato}</span>
                </>
            )}
        </span>
    );
};

const bem = bemUtils('tidUkerInput');

const TidUkeInput: React.FunctionComponent<Props> = ({
    ukeinfo,
    utilgjengeligeDatoer,
    visSomListe,
    getFieldName,
    dagLabelRenderer,
    tidPerDagValidator,
    ukeTittelRenderer,
    isWide,
}) => {
    const { dager } = ukeinfo;

    return (
        <div className={bem.element('uke')}>
            {ukeTittelRenderer ? (
                ukeTittelRenderer(ukeinfo)
            ) : (
                <Element tag="h3">
                    <FormattedMessage id="ukeÅr" values={{ ...ukeinfo }} />
                </Element>
            )}

            <div className={bem.element('uke__ukedager', isWide && visSomListe !== true ? 'grid' : 'liste')}>
                {getForegåendeDagerIUke(dager[0]).map((dag) => (
                    <div
                        className={bem.element('dag', 'utenforPeriode')}
                        key={dag.isoDateString}
                        role="presentation"
                        aria-hidden={true}>
                        {renderDagLabel(dag, dagLabelRenderer)}
                        <div className={bem.element('dag__utenforPeriodeIkon')}>-</div>
                    </div>
                ))}
                {dager.map((dag) => {
                    const erUtilgjengelig = isDateInDates(dag.dato, utilgjengeligeDatoer);
                    return (
                        <div
                            key={dag.isoDateString}
                            className={bem.element('dag', erUtilgjengelig ? 'utilgjengelig' : undefined)}>
                            {erUtilgjengelig ? (
                                <span />
                            ) : (
                                <FormikTimeInput
                                    name={getFieldName(dag)}
                                    label={renderDagLabel(dag, dagLabelRenderer)}
                                    timeInputLayout={{
                                        direction: 'horizontal',
                                    }}
                                    validate={tidPerDagValidator ? tidPerDagValidator(dag.labelFull) : undefined}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TidUkeInput;
