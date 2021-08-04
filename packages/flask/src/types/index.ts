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

/**
 * QRCodeView props
 */
export type QRCodeProps = {
    /** Type of the QR code */
    type: QRCodeType;
    /** String value to encode into the QR сode */
    value: string;
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

export type QRItemAngleSide =
    | 'TopLeft'
    | 'TopRight'
    | 'BottomRight'
    | 'BottomLeft';

export type QRItemAngleType = 'Acute' | 'Obtuse';

export type QRItemSideData = {
    topValue: number | null;
    rightValue: number | null;
    bottomValue: number | null;
    leftValue: number | null;
};

// The following type is taken from @types/react@^17.0.0 which is not yet supported in UIKit
type ForwardedRef<T> =
    | ((instance: T | null) => void)
    | React.MutableRefObject<T | null>
    | null;

export type ScreenshotViewProps = {
    ref: ForwardedRef<QRCodeRef>;
    children: React.ReactNode;
};

// eslint-disable-next-line no-shadow
export enum UIDateTimePickerMode {
    Date = 'calendar',
    Time = 'time',
}

export type PickerOptionsType = {
    backgroundColor: ColorValue,
    textHeaderColor: ColorValue,
    textDefaultColor: ColorValue,
    selectedTextColor: ColorValue,
    mainColor: ColorValue,
    textSecondaryColor: ColorValue,
    borderColor: ColorValue,
    textFontSize: number,
    textHeaderFontSize: number,
    headerAnimationDistance: number,
    daysAnimationDistance: number,
}

export type PickerPropsType  = {
    value: any,
    onTimeChange: (datetime: Date) => void,
    onDateChange: (datetime: Date) => void,
    onSelectedChange: (datetime: Date) => void,
    selected?: Date,
    minimumDate?: Date,
    maximumDate?: Date,
    minimumTime?: Date,
    maximumTime?: Date,
    currentTime?: Date,
    currentDate?: Date,
    selectorStartingYear?: number,
    selectorEndingYear?: number,
    disableDateChange?: boolean,
    isGregorian?: boolean,
    configs: string, // Object
    reverse: true | false | 'unset',
    mode: 'datepicker' | 'calendar' | 'monthYear' | 'time',
    minuteInterval?: number, // fix type
    options: PickerOptionsType,
    state: any,
    utils: any
};

export type UIDateTimePickerType = {
    selected?: Date;
    /**
     * We can display a calendar in Date view or a time picker in Time view.
     * One of:
     * - `Date`
     * - `Time`
     */
    mode: UIDateTimePickerMode;
    /* Specifies the minimum selectable date by user */
    minDate?: Date;
    /* Specifies the maximum selectable date by user */
    maxDate?: Date;
    /* Specifies the minimum selectable time by user */
    minTime?: Date;
    /* Specifies the maximum selectable time by user */
    maxTime?: Date;
    /* Initially visible month */
    currentDate?: Date;
    /* Initially visible time */
    currentTime?: Date;
    /** An interval of minutes in a time picker.
     * For example:
     * - 5 will look like 5, 10, 15, 20 ...
     */
    interval?: number;
    /* Gets called when selected value changes */
    onValueRetrieved: (datetime: Date, timezone?: number) => void;
};
