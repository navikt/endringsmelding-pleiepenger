import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import './tidFasteDagerInput.less';

interface Props<FieldName> {
    name: FieldName;
    validator?: (dagnavn: string) => ValidationFunction<ValidationError>;
}

const TidFasteDagerInput = function <FieldName>({ name, validator }: Props<FieldName>) {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tidFasteDagerInput">
                    <SoknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag` as any}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                    <SoknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag` as any}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'tirsdag')) : undefined}
                    />
                    <SoknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag` as any}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'onsdag')) : undefined}
                    />
                    <SoknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag` as any}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'torsdag')) : undefined}
                    />
                    <SoknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag` as any}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                </div>
            </Box>
        </>
    );
};

export default TidFasteDagerInput;
