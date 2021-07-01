import type { ColorVariants } from '@tonlabs/uikit.hydrogen'

export type QRCodeType = 'Default' | 'Circle';

/**
 * QRCodeView props
 */
export type QRCodeProps = {
    /** Type of the QR code */
    type: QRCodeType;
    /** String value to encode into the QR сode */
    value: string;
    /** QR code size */
    size?: number;
    /** Returns a QR code image as a string in base64 format */
    getPng?: (base64: string) => void;
    /** Image for logo in the center of the QR code */
    logo?: number;
    /** Size of logo */
    logoSize?: number;
    /** Logo image offset from logo edges */
    logoMargin?: number;
    /** Color of background of logo */
    logoBackgroundColor?: ColorVariants;
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
