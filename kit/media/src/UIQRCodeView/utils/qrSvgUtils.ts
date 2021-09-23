import type QRCode from 'qrcode';
import type { QRItemAngleSide, QRItemAngleType, QRItemRange, QRItemSideData } from '../types';
import { QR_CODE_LOGO_MARGIN_IN_SQUARES, QR_CODE_ITEM_BORDER_RADIUS } from '../constants';

const getStartLineType = (angleSide: QRItemAngleSide): string => {
    switch (angleSide) {
        case 'TopRight':
            return 'h';
        case 'BottomRight':
            return 'v';
        case 'BottomLeft':
            return 'h-';
        case 'TopLeft':
        default:
            return 'v-';
    }
};

const getEndLineType = (angleSide: QRItemAngleSide): string => {
    switch (angleSide) {
        case 'TopRight':
            return 'v';
        case 'BottomRight':
            return 'h-';
        case 'BottomLeft':
            return 'v-';
        case 'TopLeft':
        default:
            return 'h';
    }
};

const getArc = (angleSide: QRItemAngleSide, radius: number): string => {
    switch (angleSide) {
        case 'TopRight':
            return `a${radius},${radius} 0 0 1 ${radius},${radius}`;
        case 'BottomRight':
            return `a${radius},${radius} 0 0 1 -${radius},${radius}`;
        case 'BottomLeft':
            return `a${radius},${radius} 0 0 1 -${radius},-${radius}`;
        case 'TopLeft':
        default:
            return `a${radius},${radius} 0 0 1 ${radius},-${radius}`;
    }
};

const drawCorner = (
    sizeOfSquare: number,
    angleSide: QRItemAngleSide,
    angleType: QRItemAngleType,
    radius: number,
) => {
    const startLineType: string = getStartLineType(angleSide);
    const endLineType: string = getEndLineType(angleSide);
    if (angleType === 'Acute') {
        return `
            ${startLineType}${sizeOfSquare / 2}
            ${endLineType}${sizeOfSquare / 2}
        `;
    }
    const arc: string = getArc(angleSide, radius);
    const lineLength: string = `${sizeOfSquare / 2 - radius}`;
    return `
        ${startLineType}${lineLength}
        ${arc}
        ${endLineType}${lineLength}
    `;
};

const getAngleType = (sideData: QRItemSideData, angleSide: QRItemAngleSide): QRItemAngleType => {
    switch (angleSide) {
        case 'TopRight':
            return sideData.topValue || sideData.rightValue ? 'Acute' : 'Obtuse';
        case 'BottomRight':
            return sideData.bottomValue || sideData.rightValue ? 'Acute' : 'Obtuse';
        case 'BottomLeft':
            return sideData.bottomValue || sideData.leftValue ? 'Acute' : 'Obtuse';
        case 'TopLeft':
        default:
            return sideData.topValue || sideData.leftValue ? 'Acute' : 'Obtuse';
    }
};

export const draw = (
    x: number,
    y: number,
    sizeOfSquare: number,
    sideData: QRItemSideData,
    itemBorderRadius: number,
    offsetOfCoordinateGrid: number = 0,
) => {
    const scaledX = x * sizeOfSquare + offsetOfCoordinateGrid;
    const scaledY = y * sizeOfSquare + offsetOfCoordinateGrid;
    const safeRadius = itemBorderRadius > sizeOfSquare / 2 ? sizeOfSquare / 2 : itemBorderRadius;

    return `
        M${scaledX + sizeOfSquare / 2},${scaledY}
        ${drawCorner(sizeOfSquare, 'TopRight', getAngleType(sideData, 'TopRight'), safeRadius)}
        ${drawCorner(
            sizeOfSquare,
            'BottomRight',
            getAngleType(sideData, 'BottomRight'),
            safeRadius,
        )}
        ${drawCorner(sizeOfSquare, 'BottomLeft', getAngleType(sideData, 'BottomLeft'), safeRadius)}
        ${drawCorner(sizeOfSquare, 'TopLeft', getAngleType(sideData, 'TopLeft'), safeRadius)}
    `;
};

export const getEmptyAreaIndexRange = (
    size: number,
    logoSize: number,
    logoMarginInSquares: number,
    sizeOfSquare: number,
    isThereLogo: boolean,
): QRItemRange => {
    if (!isThereLogo) {
        /** EmptyArea is absent */
        return {
            start: -1,
            end: -1,
        };
    }
    const sizeInSquares = Math.round(size / sizeOfSquare);
    const logoWithMarginSizeInSquares = Math.ceil(
        (logoSize + logoMarginInSquares * sizeOfSquare * 2) / sizeOfSquare,
    );
    const offsetInSquares = Math.floor((sizeInSquares - logoWithMarginSizeInSquares) / 2);
    const start = offsetInSquares;
    const end: number = sizeInSquares - offsetInSquares - 1;
    return { start, end };
};

export const getQRSvg = (
    qr: QRCode.QRCode,
    size: number,
    logoSize: number,
    isThereLogo: boolean,
) => {
    const qrDataLength: number = qr.modules.size;

    const sizeOfSquare: number = size / qrDataLength;

    const emptyAreaIndexRange: QRItemRange = getEmptyAreaIndexRange(
        size,
        logoSize,
        QR_CODE_LOGO_MARGIN_IN_SQUARES,
        sizeOfSquare,
        isThereLogo,
    );

    const qrData: number[][] = new Array(qrDataLength)
        .fill(null)
        .map((_: null, index: number): number[] => {
            return qr.modules.data.slice(index * qrDataLength, (index + 1) * qrDataLength);
        })
        .map((row: number[], y: number): number[] => {
            return row.map((value: number, x: number): number => {
                if (
                    x >= emptyAreaIndexRange.start &&
                    x <= emptyAreaIndexRange.end &&
                    y >= emptyAreaIndexRange.start &&
                    y <= emptyAreaIndexRange.end
                ) {
                    return 0;
                }
                return value;
            });
        });

    let qrSvg = '';
    for (let y = 0; y < qrDataLength; y += 1) {
        for (let x = 0; x < qrDataLength; x += 1) {
            const currentValue: number = qrData[y][x];
            if (currentValue === 1) {
                const topValue: number | null =
                    qrData[y - 1] !== undefined ? qrData[y - 1][x] : null;
                const rightValue: number | null =
                    qrData[y][x + 1] !== undefined ? qrData[y][x + 1] : null;
                const bottomValue: number | null =
                    qrData[y + 1] !== undefined ? qrData[y + 1][x] : null;
                const leftValue: number | null =
                    qrData[y][x - 1] !== undefined ? qrData[y][x - 1] : null;
                qrSvg += ` ${draw(
                    x,
                    y,
                    sizeOfSquare,
                    {
                        topValue,
                        rightValue,
                        bottomValue,
                        leftValue,
                    },
                    QR_CODE_ITEM_BORDER_RADIUS,
                )}`;
            }
        }
    }
    return qrSvg;
};
