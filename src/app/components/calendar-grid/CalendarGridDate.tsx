import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Popover from 'nav-frontend-popover';
import React, { useState } from 'react';
import { CalendarGridPopoverContentRenderer } from './CalendarGrid';

interface Props {
    date: Date;
    popoverContentRenderer?: CalendarGridPopoverContentRenderer;
    dateRendererShort?: (date: Date) => React.ReactNode;
    dateRendererFull?: (date: Date) => React.ReactNode;
}

const bem = bemUtils('calendarGrid');

const CalendarGridDate: React.FunctionComponent<Props> = ({
    date,
    popoverContentRenderer,
    dateRendererShort = prettifyDate,
    dateRendererFull = (date) => dayjs(date).format('dddd DD. MMM'),
}) => {
    const [anker, setAnker] = useState<HTMLElement>();
    const id = `${dateToISOString(date)}_date`;

    const content = (
        <>
            <span className={bem.classNames(bem.element('date__full'))}>
                <span>{dateRendererFull(date)}</span>
            </span>
            <span className={bem.element('date__short')} id={id}>
                {dateRendererShort(date)}
            </span>
        </>
    );

    return (
        <span className={bem.element('date')}>
            {popoverContentRenderer ? (
                <button
                    style={{
                        display: 'inline',
                        background: 'transparent',
                        padding: 'none',
                        border: 'none',
                        marginRight: '-.5rem',
                    }}
                    type="button"
                    onClick={(e) => setAnker(e.currentTarget)}>
                    <Popover id={`popover_${date}`} ankerEl={anker} onRequestClose={() => setAnker(undefined)}>
                        <div style={{ padding: '1rem' }}>{popoverContentRenderer(date)}</div>
                    </Popover>
                    {content}
                </button>
            ) : (
                content
            )}
        </span>
    );
};
export default CalendarGridDate;
