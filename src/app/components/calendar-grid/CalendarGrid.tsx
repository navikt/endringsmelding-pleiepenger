import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { groupBy } from 'lodash';
import { guid } from 'nav-frontend-js-utils';
import { dateIsWeekDay, isDateInDates } from '../../utils/dateUtils';
import './calendarGrid.less';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

interface CalendarDay {
    date: Date;
    content: JSX.Element | undefined;
}

interface Week {
    year: number;
    weekNumber: number;
    days: CalendarDay[];
}

interface Props {
    days: CalendarDay[];
    month: Date;
    min?: Date;
    max?: Date;
    renderAsList?: boolean;
    disabledDates?: Date[];
    disabledDateInfo?: string;
    hideEmptyContentInListMode?: boolean;
    allDaysInWeekDisabledContentRenderer?: () => React.ReactNode;
    dateFormatter?: (date: Date) => React.ReactNode;
    dateFormatterFull?: (date: Date) => React.ReactNode;
    noContentRenderer?: (date: Date) => React.ReactNode;
}

const getFirstWeekdayOnOrAfterDate = (date: Date): Date => {
    const weekday = dayjs(date).isoWeekday();
    if (weekday <= 5) {
        return date;
    } else if (weekday === 6) {
        return dayjs(date).add(2, 'days').toDate();
    }
    return dayjs(date).add(1, 'day').toDate();
};

const getDaysInRange = (month: Date, calendarDayContent: CalendarDay[], range?: Partial<DateRange>): CalendarDay[] => {
    const from = getFirstWeekdayOnOrAfterDate(range?.from || month);
    const to = range?.to || dayjs(month).endOf('month');
    const days: Array<CalendarDay> = [];
    let current = dayjs(from).subtract(dayjs(from).isoWeekday() - 1, 'days');
    do {
        const date = current.toDate();
        if (dateIsWeekDay(current.toDate())) {
            const dayContent = calendarDayContent.find((c) => dayjs(c.date).isSame(date, 'day'));
            days.push({ date, content: dayContent !== undefined ? dayContent.content : undefined });
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(to, 'day'));
    return days;
};

const getWeeks = (days: CalendarDay[]): Week[] => {
    const weeksAndDays = groupBy(days, (day) => `week_${dayjs(day.date).isoWeek()}`);
    const weeks = Object.keys(weeksAndDays).map((key): Week => {
        const days = weeksAndDays[key];
        const weekNumber = dayjs(days[0].date).isoWeek();
        const year = dayjs(days[0].date).year();
        return { year, weekNumber, days };
    });
    return weeks;
};

const bem = bemUtils('calendarGrid');

const CalendarGrid: React.FunctionComponent<Props> = ({
    days,
    month,
    min,
    max,
    dateFormatter = prettifyDate,
    dateFormatterFull = (date) => dayjs(date).format('dddd DD. MMM'),
    noContentRenderer,
    disabledDates,
    disabledDateInfo,
    renderAsList,
    hideEmptyContentInListMode,
    allDaysInWeekDisabledContentRenderer,
}) => {
    const daysInRange = getDaysInRange(month, days, { from: min, to: max });
    const weeks = getWeeks(daysInRange);
    return (
        <div
            className={bem.classNames(
                bem.block,
                bem.modifierConditional('hideEmptyContentInListMode', hideEmptyContentInListMode),
                bem.modifier(renderAsList ? 'list' : 'grid')
            )}>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader', 'week')}>
                <FormattedMessage id="Uke" />
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Mandag" />
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Tirsdag" />
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Onsdag" />
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Torsdag" />
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                <FormattedMessage id="Fredag" />
            </span>
            {weeks.map((week) => {
                const daysInWeek = week.days;
                const weekNum = week.weekNumber;
                const areAllDaysInWeekDisabled =
                    daysInWeek.filter((d) => isDateInDates(d.date, disabledDates) === true).length ===
                    daysInWeek.length;
                return [
                    <div
                        role="presentation"
                        aria-hidden={true}
                        className={bem.element('weekNum', areAllDaysInWeekDisabled ? 'empty' : undefined)}
                        key={guid()}>
                        <span className={bem.element('weekNum_label')}>
                            <FormattedMessage id="Uke" /> {` `}
                        </span>
                        <span>{weekNum}</span>
                        {areAllDaysInWeekDisabled && allDaysInWeekDisabledContentRenderer ? (
                            <div className={bem.element('allWeekDisabledContent')}>
                                {allDaysInWeekDisabledContentRenderer()}
                            </div>
                        ) : undefined}
                    </div>,
                    daysInWeek.map((d) => {
                        const dateIsDisabled = isDateInDates(d.date, disabledDates);
                        return dayjs(d.date).isSame(month, 'month') === false ||
                            (min && dayjs(d.date).isBefore(min, 'day')) ? (
                            <div
                                key={guid()}
                                aria-hidden={true}
                                className={bem.classNames(bem.element('day', 'outsideMonth'))}
                            />
                        ) : (
                            <div
                                key={guid()}
                                aria-hidden={d.content === undefined}
                                className={bem.classNames(
                                    bem.child('day').block,
                                    bem.child('day').modifierConditional('empty', d.content === undefined),
                                    bem.child('day').modifierConditional('disabled', dateIsDisabled)
                                )}>
                                <div
                                    className={bem.element('date')}
                                    title={dateIsDisabled ? disabledDateInfo : undefined}>
                                    <span className={bem.classNames(bem.element('date__full'))}>
                                        <span>{dateFormatterFull(d.date)}</span>
                                    </span>
                                    <span className={bem.element('date__short')}>{dateFormatter(d.date)}</span>
                                </div>
                                <div>
                                    {d.content || (noContentRenderer !== undefined ? noContentRenderer(d.date) : null)}
                                </div>
                            </div>
                        );
                    }),
                ];
            })}
        </div>
    );
};

export default CalendarGrid;
