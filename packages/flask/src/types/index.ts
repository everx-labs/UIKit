export type QRCodeType = 'Default' | 'Circle';

export type QRCodeProps = {
    type: QRCodeType;
    value: string;
    size?: number;
    getPng?: (base64: string) => void; // returns base64
    logo?: number;
    logoSize?: number;
    logoMargin?: number;
    logoBackgroundColor?: string;
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
