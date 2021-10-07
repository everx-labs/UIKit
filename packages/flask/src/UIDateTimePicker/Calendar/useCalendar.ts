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

function getDateIsDisabled(date: Dayjs, min?: Date, max?: Date) {
    let disabled = false;
    if (min) {
        disabled = date.isBefore(min);
    }
    if (max && !disabled) {
        disabled = date.isAfter(max);
    }
    return disabled;
}

function getDaysMatrix(
    selectedMonth: number,
    selectedYear: number,
    dayNamesShort: string[],
    min?: Date,
    max?: Date,
) {
    const date = dayjs().month(selectedMonth).year(selectedYear);
    /**
     * TODO: it's for now starts with Sunday
     *       this is wrong and should be localized!
     */
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

        const thisDay = date.date(n + 1);
        const disabled = getDateIsDisabled(thisDay, min, max);
        const item: DayCell = {
            type: 'dayCell',
            dayString: `${n + 1}`,
            date: thisDay,
            disabled,
        };

        daysMatrix[column].push(item);
    }

    return {
        firstDayShift,
        daysMatrix,
    };
}

export function useDaysCalendar() {
    const {
        state: { selectedDate, selectedMonth, selectedYear },
        dispatch,
        min,
        max,
    } = useDateTimeState();
    const date = React.useMemo(() => selectedDate ?? dayjs(), [selectedDate]);

    const dayNamesShort = React.useMemo(
        () => Object.values(uiLocalized.DateTimePicker.dayNamesShort),
        [],
    );

    const { firstDayShift, daysMatrix } = React.useMemo(() => {
        return getDaysMatrix(selectedMonth, selectedYear, dayNamesShort, min, max);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear, dayNamesShort, min, max]);

    const [activeDayRow, activeDayColumn] = React.useMemo(() => {
        if (date.month() !== selectedMonth || date.year() !== selectedYear) {
            return [-1, -1];
        }
        const day = date.date() + firstDayShift - 1;
        const dayRow = Math.trunc(day / dayNamesShort.length);
        const dayColumn = day - dayRow * dayNamesShort.length;

        return [dayRow + 1, dayColumn];
    }, [date, firstDayShift, dayNamesShort.length, selectedMonth, selectedYear]);

    const onSelect = React.useCallback(
        (column: number, row: number) => {
            const day = daysMatrix[column][row];

            if (!day) {
                return;
            }

            if (day.type !== 'dayCell') {
                return;
            }

            dispatch({
                type: DateTimeActionType.SetDay,
                selectedDate: day.date,
            });
        },
        [daysMatrix, dispatch],
    );

    const onPrev = React.useCallback(() => {
        if (activeDayColumn < 0 || activeDayRow < 0) {
            const newDate = selectedDate.subtract(1, 'day');

            if (min != null && newDate.isBefore(min)) {
                return;
            }

            dispatch({
                type: DateTimeActionType.SetDay,
                selectedDate: newDate,
            });
            return;
        }

        const day = daysMatrix[activeDayColumn][activeDayRow];

        if (!day) {
            return;
        }

        if (day.type !== 'dayCell') {
            return;
        }

        const newDate = day.date.subtract(1, 'day');

        if (min != null && newDate.isBefore(min)) {
            return;
        }

        dispatch({
            type: DateTimeActionType.SetDay,
            selectedDate: newDate,
        });
    }, [daysMatrix, dispatch, activeDayRow, activeDayColumn, min, selectedDate]);

    const onNext = React.useCallback(() => {
        if (activeDayColumn < 0 || activeDayRow < 0) {
            const newDate = selectedDate.add(1, 'day');

            if (max != null && newDate.isAfter(max)) {
                return;
            }

            dispatch({
                type: DateTimeActionType.SetDay,
                selectedDate: newDate,
            });
            return;
        }

        const day = daysMatrix[activeDayColumn][activeDayRow];

        if (!day) {
            return;
        }

        if (day.type !== 'dayCell') {
            return;
        }

        const newDate = day.date.add(1, 'day');

        if (max != null && newDate.isAfter(max)) {
            return;
        }

        dispatch({
            type: DateTimeActionType.SetDay,
            selectedDate: newDate,
        });
    }, [daysMatrix, dispatch, activeDayRow, activeDayColumn, max, selectedDate]);

    return {
        activeDayColumn,
        activeDayRow,
        daysMatrix,
        onSelect,
        onPrev,
        onNext,
        // @ts-ignore
        month: uiLocalized.DateTimePicker.monthNames[selectedMonth],
        year: `${selectedYear}`,
    };
}

export function useAditionalCalendars() {
    const {
        state: { isMonthsVisible, isYearsVisible, selectedMonth, selectedYear },
        dispatch,
        max,
        min,
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

    const onPrevMonth = React.useCallback(() => {
        const prevMonth = Math.max(selectedMonth - 1, 0);
        if (min != null && dayjs(min).month() > prevMonth) {
            return;
        }
        dispatch({
            type: DateTimeActionType.SetMonth,
            selectedMonth: prevMonth,
        });
    }, [dispatch, selectedMonth, min]);

    const onNextMonth = React.useCallback(() => {
        const nextMonth = Math.max(selectedMonth + 1, 0);
        if (max != null && dayjs(max).month() < nextMonth) {
            return;
        }
        dispatch({
            type: DateTimeActionType.SetMonth,
            selectedMonth: nextMonth,
        });
    }, [dispatch, selectedMonth, max]);

    const onPrevYear = React.useCallback(() => {
        const prevYear = Math.min(selectedYear - 1, EARLIEST_YEAR);
        if (min != null && dayjs(min).year() > prevYear) {
            return;
        }
        dispatch({
            type: DateTimeActionType.SetYear,
            selectedYear: prevYear,
        });
    }, [dispatch, selectedYear, min]);

    const onNextYear = React.useCallback(() => {
        const nextYear = Math.max(selectedYear + 1, EARLIEST_YEAR + YEARS_COUNT);
        if (max != null && dayjs(max).year() < nextYear) {
            return;
        }
        dispatch({
            type: DateTimeActionType.SetYear,
            selectedYear: nextYear,
        });
    }, [dispatch, selectedYear, max]);

    return {
        isMonthsVisible,
        openMonths,
        isYearsVisible,
        openYears,
        onPrevMonth,
        onNextMonth,
        onPrevYear,
        onNextYear,
    };
}

type MonthCell = {
    id: number;
    label: string;
};

export type MonthCells = MonthCell;

export function useMonths() {
    const {
        state: { selectedMonth, selectedYear },
        dispatch,
        min,
        max,
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
                });

                return acc;
            }, []),
        [],
    );

    const [currentRow, currentColumn] = React.useMemo(() => {
        const row = Math.trunc(selectedMonth / 3);
        const column = selectedMonth - row * 3;

        return [row, column];
    }, [selectedMonth]);

    const minMonth = React.useMemo(() => {
        if (min == null) {
            return 0;
        }
        const m = dayjs(min);

        if (selectedYear < m.year()) {
            12;
        }

        return m.month();
    }, [min, selectedYear]);

    const maxMonth = React.useMemo(() => {
        if (max == null) {
            return 12;
        }
        const m = dayjs(max);

        if (selectedYear > m.year()) {
            0;
        }

        return m.month();
    }, [max, selectedYear]);

    const onSelect = React.useCallback(
        (month: number) => {
            dispatch({
                type: DateTimeActionType.ToggleMonths,
            });
            dispatch({
                type: DateTimeActionType.SetMonth,
                selectedMonth: month,
            });
        },
        [dispatch],
    );

    return {
        monthsMatrix,
        currentRow,
        currentColumn,
        minMonth,
        maxMonth,
        onSelect,
    };
}

const EARLIEST_YEAR = 1900;
const YEARS_IN_ROW = 3;
const YEARS_COUNT = 3 * 60;

export function useYears() {
    const {
        state: { selectedYear },
        dispatch,
        min,
        max,
    } = useDateTimeState();

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

    const selectedRow = React.useMemo(() => {
        const row = Math.trunc((selectedYear - EARLIEST_YEAR) / YEARS_IN_ROW);

        return row;
    }, [selectedYear]);

    const onSelect = React.useCallback(
        (year: number) => {
            dispatch({
                type: DateTimeActionType.ToggleYears,
            });
            dispatch({
                type: DateTimeActionType.SetYear,
                selectedYear: year,
            });
        },
        [dispatch],
    );

    const minYear = React.useMemo(() => {
        if (min == null) {
            return 0;
        }

        return dayjs(min).year();
    }, [min]);

    const maxYear = React.useMemo(() => {
        if (max == null) {
            return Infinity;
        }

        return dayjs(max).year();
    }, [max]);

    return {
        selectedYear,
        selectedRow,
        yearsMatrix,
        minYear,
        maxYear,
        onSelect,
    };
}
