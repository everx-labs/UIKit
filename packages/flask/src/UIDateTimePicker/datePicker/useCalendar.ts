import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { CalendarContext } from './calendarContext';

import { PickerActionName } from '../../types';

dayjs.extend(localeData);

type DayLabel = {
    type: 'dayLabel';
    label: string;
};

type DayFiller = {
    type: 'dayFiller';
};

type DayCell = {
    type: 'dayCell';
    dayString: string;
    date: Dayjs;
    disabled: boolean;
};

export type DayCells = DayLabel | DayFiller | DayCell;

export type DaysMatrix = DayCells[][];

function getDaysMatrix(date: Dayjs, dayNamesShort: string[], min?: Date, max?: Date) {
    const currentMonthDays = date.daysInMonth();
    const firstDayShift = date.date(1).day();

    const daysMatrix: DaysMatrix = [];

    for (let n = -firstDayShift; n < currentMonthDays; n += 1) {
        const row = Math.trunc((n + firstDayShift) / dayNamesShort.length);
        const column = n + firstDayShift - row * dayNamesShort.length;

        if (daysMatrix[column] == null) {
            daysMatrix[column] = [
                {
                    type: 'dayLabel',
                    label: dayNamesShort[column],
                },
            ];
        }

        if (n < 0) {
            daysMatrix[column].push({
                type: 'dayFiller',
            });
            continue;
        }

        let disabled = false;
        const thisDay = date.date(n + 1);
        if (min) {
            disabled = thisDay.isBefore(min);
        }
        if (max && !disabled) {
            disabled = thisDay.isAfter(max);
        }
        const item: DayCell = {
            type: 'dayCell',
            dayString: `${n + 1}`,
            date: date.date(n + 1),
            disabled,
        };

        daysMatrix[column].push(item);
    }

    return {
        firstDayShift,
        daysMatrix,
    };
}

function dateWithConstraints(currentDate: Dayjs, min?: Date, max?: Date) {
    if (min && currentDate.isBefore(min)) {
        return dayjs(min);
    }
    if (max && currentDate.isAfter(max)) {
        return dayjs(max);
    }
    return currentDate;
}

export function useCalendar() {
    const {
        state: { activeDate, selectedDate },
        dispatch,
        min,
        max,
    } = React.useContext(CalendarContext);

    const dayNamesShort = (dayjs as any) // marking it as any as we use plugin here
        .weekdays()
        .map((weekday: keyof typeof uiLocalized['DateTimePicker']['dayNamesShort']) => {
            return uiLocalized.DateTimePicker.dayNamesShort[weekday];
        });

    const [currentYear, currentMonth] = React.useMemo(
        () => [activeDate.year(), activeDate.month()],
        [activeDate],
    );

    const { firstDayShift, daysMatrix } = React.useMemo(() => {
        return getDaysMatrix(activeDate, dayNamesShort, min, max);
    }, [currentYear, currentMonth]);

    const [activeDayRow, activeDayColumn] = React.useMemo(() => {
        const activeDay = selectedDate.date() + firstDayShift;
        const activeDayRow = Math.trunc(activeDay / dayNamesShort.length);
        const activeDayColumn = activeDay - activeDayRow * dayNamesShort.length - 1;

        return [activeDayRow + 1, activeDayColumn];
    }, [selectedDate, firstDayShift]);

    const onSelect = React.useCallback(
        (column, row) => {
            const day = daysMatrix[column][row];

            if (!day) {
                return;
            }

            if (day.type !== 'dayCell') {
                return;
            }

            const newDate = dateWithConstraints(day.date);
            dispatch({
                type: PickerActionName.Set,
                payload: {
                    selectedDate: newDate,
                },
            });
        },
        [activeDate],
    );

    return {
        activeDayColumn,
        activeDayRow,
        daysMatrix,
        onSelect,
    };
}
