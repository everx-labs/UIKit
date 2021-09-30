import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { CalendarContext } from './calendarContext';

import { PickerActionName } from '../../types';

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

export function useDaysCalendar() {
    const {
        state: { selectedDate },
        dispatch,
        min,
        max,
    } = React.useContext(CalendarContext);

    const dayNamesShort = React.useMemo(
        () => Object.values(uiLocalized.DateTimePicker.dayNamesShort),
        [],
    );

    const [currentYear, currentMonth] = React.useMemo(
        () => [selectedDate.year(), selectedDate.month()],
        [selectedDate],
    );

    const { firstDayShift, daysMatrix } = React.useMemo(() => {
        return getDaysMatrix(selectedDate, dayNamesShort, min, max);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentYear, currentMonth, dayNamesShort, min, max]);

    const [activeDayRow, activeDayColumn] = React.useMemo(() => {
        const day = selectedDate.date() + firstDayShift - 1;
        const dayRow = Math.trunc(day / dayNamesShort.length);
        const dayColumn = day - dayRow * dayNamesShort.length;

        return [dayRow + 1, dayColumn];
    }, [selectedDate, firstDayShift, dayNamesShort.length]);

    console.log(selectedDate, activeDayRow, activeDayColumn);

    const onSelect = React.useCallback(
        (column: number, row: number) => {
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
        [daysMatrix, dispatch],
    );

    const onPrev = React.useCallback(() => {
        const day = daysMatrix[activeDayColumn][activeDayRow];

        if (!day) {
            return;
        }

        if (day.type !== 'dayCell') {
            return;
        }

        const newDate = dateWithConstraints(day.date.subtract(1, 'day'));
        dispatch({
            type: PickerActionName.Set,
            payload: {
                selectedDate: newDate,
            },
        });
    }, [daysMatrix, dispatch, activeDayRow, activeDayColumn]);

    const onNext = React.useCallback(() => {
        const day = daysMatrix[activeDayColumn][activeDayRow];

        if (!day) {
            return;
        }

        if (day.type !== 'dayCell') {
            return;
        }

        const newDate = dateWithConstraints(day.date.add(1, 'day'));
        dispatch({
            type: PickerActionName.Set,
            payload: {
                selectedDate: newDate,
            },
        });
    }, [daysMatrix, dispatch, activeDayRow, activeDayColumn]);

    return {
        activeDayColumn,
        activeDayRow,
        daysMatrix,
        onSelect,
        onPrev,
        onNext,
        month: uiLocalized.DateTimePicker.monthNames[currentMonth],
        year: `${currentYear}`,
    };
}

export function useMonthsCalendar() {
    const {
        state: { activeDate },
    } = React.useContext(CalendarContext);

    const monthNames = React.useMemo(
        () => Object.values(uiLocalized.DateTimePicker.monthNames),
        [],
    );
}
