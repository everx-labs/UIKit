import type { Dayjs } from 'dayjs';

// eslint-disable-next-line no-shadow
export enum UIDateTimePickerMode {
    DateTime = 'datepicker',
    Date = 'calendar',
    Time = 'time',
    // TODO: return it!
    // MonthYear = 'monthYear',
}

export type UIDateTimePickerProps = {
    /**
     * Initially visible date
     */
    defaultDate?: Date;
    /**
     * We can display a calendar in Date view or a time picker in Time view.
     * One of:
     * - `Date`
     * - `Time`
     */
    mode: UIDateTimePickerMode;
    /* Specifies the minimum selectable date/time by user */
    min?: Date;
    /* Specifies the maximum selectable date/time by user */
    max?: Date;
    /** An interval of minutes in a time picker.
     * For example:
     * - 5 will look like 5, 10, 15, 20 ...
     */
    interval?: number;
    /* Gets called when selected value changes */
    onValueRetrieved: (datetime: Date) => void;
    /* Callback on close */
    onClose: () => void;
    /**
     * Used to show/hide UIBottomSheet
     */
    visible: boolean;
    /**
     * Used to show/hide UIBottomSheet
     */
    isAmPmTime?: boolean;
};

// eslint-disable-next-line no-shadow
export enum DateTimeActionType {
    SetDay = 'setDay',
    SetMonth = 'setMonth',
    SetYear = 'setYear',
    SetTime = 'setTime',
    // ToggleTime = 'toggleTime',
    ToggleMonths = 'ToggleMonths',
    ToggleYears = 'ToggleYears',
}

export type DateTimeState = {
    selectedDate: Dayjs;
    selectedTime: Dayjs | null;
    selectedMonth: number;
    selectedYear: number;
    isMonthsVisible: boolean;
    isYearsVisible: boolean;
};

export type DateTimeAction =
    | {
          type: DateTimeActionType.ToggleMonths;
      }
    | {
          type: DateTimeActionType.ToggleYears;
      }
    | {
          type: DateTimeActionType.SetMonth;
          selectedMonth: number;
      }
    | {
          type: DateTimeActionType.SetYear;
          selectedYear: number;
      }
    | {
          type: DateTimeActionType.SetDay;
          selectedDate: Dayjs;
      }
    | {
          type: DateTimeActionType.SetTime;
          selectedTime: Dayjs | null;
      };
