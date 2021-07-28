import type { ImageSourcePropType } from 'react-native';

// eslint-disable-next-line no-shadow
export enum QRCodeType {
    Square = 'Square',
    Circle = 'Circle',
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

export type UIDateTimePickerType = {
    mode: UIDateTimePickerMode; // mode of date time picker can display the date and time in one view, or each separately ( Date, Time)
    minDate?: Date; // minimal date to choose
    maxDate?: Date; // maximum date to choose
    currentDate?: Date; // current(default) date
    minTime?: Date; // minimal time to choose
    maxTime?: Date;  // maximum time to choose
    currentTime?: Date; // current(default) time
    interval?: number; // an interval of minutes in a time picker, for example 5 will look like 5, 10, 15, 20 ...
    onValueRetrieved: (datetime: Date, timezone?: number) => void;
};
