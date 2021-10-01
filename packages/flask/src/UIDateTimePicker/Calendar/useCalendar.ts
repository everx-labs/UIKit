import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { DateTimeActionType } from '../types';
import { useDateTimeState } from '../useDateTimeState';

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
    } = useDateTimeState();

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
                type: DateTimeActionType.Set,
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
            type: DateTimeActionType.Set,
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
            type: DateTimeActionType.Set,
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
        // @ts-ignore
        month: uiLocalized.DateTimePicker.monthNames[currentMonth],
        year: `${currentYear}`,
    };
}

export function useAditionalCalendars() {
    const {
        state: { isMonthsVisible, isYearsVisible },
        dispatch,
    } = useDateTimeState();

    const openMonths = React.useCallback(() => {
        dispatch({
            type: DateTimeActionType.ToggleMonths,
        });
    }, [dispatch]);

    const openYears = React.useCallback(() => {
        dispatch({
            type: DateTimeActionType.ToggleYears,
        });
    }, [dispatch]);

    return {
        isMonthsVisible,
        openMonths,
        isYearsVisible,
        openYears,
    };
}

type MonthCell = {
    id: number;
    label: string;
};

export type MonthCells = MonthCell;

export function useMonths() {
    const {
        state: { selectedDate },
        dispatch,
    } = useDateTimeState();

    const monthsMatrix = React.useMemo(
        () =>
            new Array(12).fill(null).reduce<MonthCell[][]>((acc, _, index) => {
                const row = Math.trunc(index / 3);
                const column = index - row * 3;

                if (acc[column] == null) {
                    acc[column] = [];
                }

                acc[column].push({
                    id: index,
                    // @ts-ignore
                    label: uiLocalized.DateTimePicker.monthNames[index],
                    // disabled TODO!
                });

                return acc;
            }, []),
        [],
    );

    const currentMonth = React.useMemo(() => {
        return selectedDate.month();
    }, [selectedDate]);

    const [currentRow, currentColumn] = React.useMemo(() => {
        const row = Math.trunc(currentMonth / 3);
        const column = currentMonth - row * 3;

        return [row, column];
    }, [currentMonth]);

    const onSelect = React.useCallback(
        (month: number) => {
            const newDate = dateWithConstraints(selectedDate.month(month));
            dispatch({
                type: DateTimeActionType.ToggleMonths,
                payload: {
                    selectedDate: newDate,
                },
            });
            dispatch({
                type: DateTimeActionType.Set,
                payload: {
                    selectedDate: newDate,
                },
            });
        },
        [dispatch, selectedDate],
    );

    return {
        monthsMatrix,
        currentRow,
        currentColumn,
        onSelect,
    };
}

const EARLIEST_YEAR = 1900;
const YEARS_IN_ROW = 3;
const YEARS_COUNT = 3 * 60;

export function useYears() {
    const {
        state: { selectedDate },
        dispatch,
    } = useDateTimeState();

    // TODO: disabled!
    const yearsMatrix = React.useMemo(() => {
        return new Array(YEARS_COUNT).fill(null).reduce<number[][]>((acc, _, i) => {
            const row = Math.trunc(i / YEARS_IN_ROW);

            if (acc[row] == null) {
                acc[row] = [];
            }

            acc[row].push(EARLIEST_YEAR + i);

            return acc;
        }, []);
    }, []);

    const [selectedYear, selectedRow] = React.useMemo(() => {
        const y = selectedDate.year();
        const row = Math.trunc((y - EARLIEST_YEAR) / YEARS_IN_ROW);

        return [y, row];
    }, [selectedDate]);

    const onSelect = React.useCallback(
        (year: number) => {
            const newDate = dateWithConstraints(selectedDate.year(year));
            dispatch({
                type: DateTimeActionType.ToggleYears,
                payload: {
                    selectedDate: newDate,
                },
            });
            dispatch({
                type: DateTimeActionType.Set,
                payload: {
                    selectedDate: newDate,
                },
            });
        },
        [selectedDate, dispatch],
    );

    return {
        selectedYear,
        selectedRow,
        yearsMatrix,
        onSelect,
    };
}
