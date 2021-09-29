import type { Dayjs } from 'dayjs';
import type React from 'react';
import type { ColorValue, ImageSourcePropType } from 'react-native';

// eslint-disable-next-line no-shadow
export enum QRCodeType {
    Square = 'Square',
    Circle = 'Circle',
}

// eslint-disable-next-line no-shadow
export enum QRCodeSize {
    Large = 'Large',
    Medium = 'Medium',
}

export type QRCodeRef = {
    /** Returns a QR code image as a string in base64 format */
    getPng: () => Promise<string | null>;
};

// eslint-disable-next-line no-shadow
export enum QRCodeError {
    DataTooLong,
    DataIsEmpty,
}

/**
 * QRCodeView props
 */
export type QRCodeProps = {
    /** Type of the QR code */
    type: QRCodeType;
    /** String value to encode into the QR сode */
    value: string;
    /** Called if it is impossible to draw a QR code */
    onError?: (error: QRCodeError) => void;
    /** Called if the QR code is successfully drawn */
    onSuccess?: () => void;
    /**
     * Size of the QR code image (without padding)
     * @default QRCodeSize.Large
     */
    size?: QRCodeSize;
    /** Used to get an image of the QR code */
    ref?: QRCodeRef;
    /** Image for logo in the center of the QR code */
    logo?: ImageSourcePropType;
    /** ID for usage in tests */
    testID?: string;
};

export type QRItemRange = {
    start: number;
    end: number;
};

export type QRItemAngleSide = 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft';

export type QRItemAngleType = 'Acute' | 'Obtuse';

export type QRItemSideData = {
    topValue: number | null;
    rightValue: number | null;
    bottomValue: number | null;
    leftValue: number | null;
};

// The following type is taken from @types/react@^17.0.0 which is not yet supported in UIKit
type ForwardedRef<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

export type ScreenshotViewProps = {
    ref: ForwardedRef<QRCodeRef>;
    children: React.ReactNode;
};

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
    mode: UIDateTimePickerMode;
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

export type PickerPropsType<Utils> = UIDateTimePickerType & {
    onChange?: (datetime: Date) => void;
    onMonthYearChange?: (datetime: Date) => void;
    value?: any;
    selectorStartingYear?: number;
    selectorEndingYear?: number;
    disableDateChange?: boolean;
    reverse?: true | false | 'unset';
    options: PickerOptionsType;
    state: PickerStateType;
    dispatch: React.Dispatch<PickerAction>;
    utils: Utils;
};

// eslint-disable-next-line no-shadow
export enum PickerActionName {
    Set = 'set',
    ToggleTime = 'toggleTime',
    ToggleMonth = 'toggleMonth',
}

export type PickerAction = {
    type: PickerActionName;
    payload?: Partial<PickerStateType>;
};
export type PickerStateType = {
    activeDate: Date;
    selectedDate: Dayjs;
};

// Country picker types

export type Country = {
    code: string;
    name: string;
    emoji: string;
};

export type CountriesArray = Country[] | [];

export type CountryPickerProps = {
    /** Callback on close */
    onClose: () => void;
    /** Called if some item is selected */
    onSelect?: (countryCode: string) => void;
    /** Array of allowed countries codes */
    permitted?: string[];
    /** Array of countries codes to exclude */
    banned?: string[];
};

export type WrappedCountryPickerProps = CountryPickerProps & {
    visible: boolean;
};
