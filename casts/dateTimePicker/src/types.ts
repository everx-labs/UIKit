import type { ColorValue } from 'react-native';

// eslint-disable-next-line no-shadow
export enum UIDateTimePickerMode {
    DateTime = 'datepicker',
    Date = 'calendar',
    Time = 'time',
    MonthYear = 'monthYear',
}

export type PickerOptionsType = {
    backgroundColor: ColorValue;
    textHeaderColor: ColorValue;
    textDefaultColor: ColorValue;
    selectedTextColor: ColorValue;
    mainColor: ColorValue;
    textSecondaryColor: ColorValue;
    borderColor: ColorValue;
    textFontSize: number;
    textHeaderFontSize: number;
    headerAnimationDistance: number;
    daysAnimationDistance: number;
};

export type UIDateTimePickerType = {
    /**
     * Current selected time or month of year
     */
    selected?: Date;
    /**
     * We can display a calendar in Date view or a time picker in Time view.
     * One of:
     * - `Date`
     * - `Time`
     */
    mode?: UIDateTimePickerMode;
    /* Specifies the minimum selectable date/time by user */
    min?: Date;
    /* Specifies the maximum selectable date/time by user */
    max?: Date;
    /* Initially visible month/time */
    current?: Date;
    /** An interval of minutes in a time picker.
     * For example:
     * - 5 will look like 5, 10, 15, 20 ...
     */
    interval?: number;
    /* Gets called when selected value changes */
    onValueRetrieved: (datetime: Date) => void;
};

export type PickerPropsType = UIDateTimePickerType & {
    onChange?: (datetime: Date) => void;
    onMonthYearChange?: (datetime: Date) => void;
    value?: any;
    selectorStartingYear?: number;
    selectorEndingYear?: number;
    disableDateChange?: boolean;
    reverse?: true | false | 'unset';
    options: PickerOptionsType;
    state?: any;
    utils?: any;
};

// eslint-disable-next-line no-shadow
export enum PickerActionName {
    Set = 'set',
    ToggleTime = 'toggleTime',
    ToggleMonth = 'toggleMonth',
}

export type PickerAction = {
    value: any;
    type: PickerActionName;
    state: PickerStateType;
};
export type PickerStateType = {
    activeDate?: Date;
    selectedDate?: Date;
    timeOpen?: boolean;
    monthOpen?: boolean;
};
