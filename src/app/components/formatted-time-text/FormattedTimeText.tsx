import React from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { Time } from '@navikt/sif-common-formik';
import { InputTime } from '../../types';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';

const ensureTime = (time: InputTime): Time => {
    return {
        hours: time.hours || '0',
        minutes: time.minutes || '0',
    };
};

export type FormattedTimeFormat = 'decimal' | 'digital' | 'default';

const FormattedTimeText = ({
    time,
    fullText,
    hideEmptyValues = false,
    format,
}: {
    time: InputTime;
    fullText?: boolean;
    hideEmptyValues?: boolean;
    format?: FormattedTimeFormat;
}): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    const intl = useIntl();

    switch (format) {
        case 'decimal':
            return (
                <>
                    <FormattedNumber value={timeToDecimalTime(ensureTime(time))} maximumFractionDigits={2} />
                    {` `}t.
                </>
            );
        case 'digital':
            return (
                <span className="formattedTime--digital">
                    {timer}:{minutter}
                </span>
            );
        default:
            if (hideEmptyValues && timer === '0' && minutter !== '0') {
                return <></>;
            }
            const ariaText = `${intlHelper(intl, 'timer', { timer })}
            ${intlHelper(intl, 'minutter', { minutter })}`;
            return (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {fullText ? (
                        <>{ariaText}</>
                    ) : (
                        <AriaAlternative visibleText={`${timer} t. ${minutter} m.`} ariaText={ariaText} />
                    )}
                </span>
            );
    }
};

export default FormattedTimeText;
