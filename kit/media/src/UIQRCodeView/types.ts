import type { ImageSourcePropType } from 'react-native';

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
    /** String value to encode into the QR code */
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
