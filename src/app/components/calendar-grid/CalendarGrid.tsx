import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { groupBy } from 'lodash';
import { guid } from 'nav-frontend-js-utils';
import { dateIsWeekDay, getFirstDateOfWeek, isDateInDates } from '../../utils/dateUtils';
import CalendarGridDate from './CalendarGridDate';
import './calendarGrid.less';

dayjs.extend(isSameOrBefore);

interface WeekToRender {
    weekNumber: number;
    dates: Date[];
}

export type CalendarGridPopoverContentRenderer = (date: Date) => React.ReactNode;

interface Props {
    month: DateRange;
    renderAsList?: boolean;
    disabledDates?: Date[];
    disabledDateInfo?: string;
    hideEmptyContentInListMode?: boolean;
    popoverContentRenderer?: CalendarGridPopoverContentRenderer;
    dateContentRenderer: (date: Date, isDisabled?: boolean) => React.ReactNode;
    dateRendererShort?: (date: Date) => React.ReactNode;
    dateRendererFull?: (date: Date) => React.ReactNode;
    allDaysInWeekDisabledContentRenderer?: () => React.ReactNode;
}

const getDatesToRender = ({ from, to }: DateRange): Date[] => {
    const dates: Date[] = [];
    let current = dayjs(getFirstDateOfWeek(from));
    do {
        const date = current.toDate();
        if (dateIsWeekDay(current.toDate())) {
            dates.push(date);
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(to, 'day'));
    return dates;
};

const getWeeks = (datesToRender: Date[], month: Date): WeekToRender[] => {
    const weeksAndDays = groupBy(datesToRender, (date) => `week_${dayjs(date).isoWeek()}`);
    const weeks: WeekToRender[] = [];
    Object.keys(weeksAndDays).forEach((key) => {
        const dates = weeksAndDays[key];
        const weekHasDatesInMonth = dates.some((d) => dayjs(d).isSame(month, 'month'));
        if (weekHasDatesInMonth && dates.length > 0) {
            weeks.push({
                weekNumber: dayjs(dates[0]).isoWeek(),
                dates,
            });
        }
    });
    return weeks;
};

const bem = bemUtils('calendarGrid');

const CalendarGrid: React.FunctionComponent<Props> = ({
    month,
    disabledDates,
    disabledDateInfo,
    renderAsList,
    hideEmptyContentInListMode,
    popoverContentRenderer,
    dateContentRenderer,
    dateRendererShort = prettifyDate,
    dateRendererFull = (date) => dayjs(date).format('dddd DD. MMM'),
    allDaysInWeekDisabledContentRenderer,
}) => {
    const weeks = getWeeks(getDatesToRender(month), month.from);

    const renderDate = (date: Date) => {
        const dateKey = date.toDateString();
        const dateIsDisabled = isDateInDates(date, disabledDates);
        return dayjs(date).isSame(month.from, 'month') === false ? (
            <div key={dateKey} aria-hidden={true} className={bem.classNames(bem.element('day', 'outsideMonth'))} />
        ) : (
            <div
                title={dateIsDisabled ? disabledDateInfo : undefined}
                key={dateKey}
                className={bem.classNames(
                    bem.child('day').block,
                    bem.child('day').modifierConditional('disabled', dateIsDisabled)
                )}>
                <CalendarGridDate
                    date={date}
                    dateRendererFull={dateRendererFull}
                    dateRendererShort={dateRendererShort}
                    popoverContentRenderer={dateIsDisabled ? undefined : popoverContentRenderer}
                />
                <div className={bem.child('day').element('content')}>
                    {dateContentRenderer(date, dateIsDisabled)}
                    {/* TODO 
                    <div className="tidsinfo__group">
                        <div className="tidnormalt tidsinfo">
                            Nor: <span className="tidsinfo__value">7:30</span>
                        </div>
                        <div className="tidomsorg tidsinfo">
                            Oms.: <span className="tidsinfo__value">7:30</span>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    };

    const renderWeek = (week: WeekToRender) => {
        const datesInWeek = week.dates;
        const weekNum = week.weekNumber;
        const areAllDaysInWeekDisabled =
            allDaysInWeekDisabledContentRenderer !== undefined &&
            datesInWeek.filter((date) => isDateInDates(date, disabledDates) === true).length === datesInWeek.length;
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
            datesInWeek.map(renderDate),
        ];
    };
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
            {weeks.map(renderWeek)}
        </div>
    );
};

export default CalendarGrid;
