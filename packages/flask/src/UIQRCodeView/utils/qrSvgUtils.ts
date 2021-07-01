import type QRCode from 'qrcode';
import type {
    QRItemAngleSide,
    QRItemAngleType,
    QRItemRange,
    QRItemSideData,
} from '../../types';

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

const getAngleType = (
    sideData: QRItemSideData,
    angleSide: QRItemAngleSide,
): QRItemAngleType => {
    switch (angleSide) {
        case 'TopRight':
            return sideData.topValue || sideData.rightValue
                ? 'Acute'
                : 'Obtuse';
        case 'BottomRight':
            return sideData.bottomValue || sideData.rightValue
                ? 'Acute'
                : 'Obtuse';
        case 'BottomLeft':
            return sideData.bottomValue || sideData.leftValue
                ? 'Acute'
                : 'Obtuse';
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
    radius: number,
) => {
    const scaledX = x * sizeOfSquare;
    const scaledY = y * sizeOfSquare;

    return `
        M${scaledX + sizeOfSquare / 2},${scaledY}
        ${drawCorner(
            sizeOfSquare,
            'TopRight',
            getAngleType(sideData, 'TopRight'),
            radius,
        )}
        ${drawCorner(
            sizeOfSquare,
            'BottomRight',
            getAngleType(sideData, 'BottomRight'),
            radius,
        )}
        ${drawCorner(
            sizeOfSquare,
            'BottomLeft',
            getAngleType(sideData, 'BottomLeft'),
            radius,
        )}
        ${drawCorner(
            sizeOfSquare,
            'TopLeft',
            getAngleType(sideData, 'TopLeft'),
            radius,
        )}
    `;
};

export const getEmptyIndexRange = (
    size: number,
    logoSize: number,
    logoMargin: number,
    sizeOfSquare: number,
    qrDataLength: number,
): QRItemRange => {
    const offset = size / 2 - logoSize / 2 - logoMargin;
    const offsetInSquares: number = Math.floor(offset / sizeOfSquare);
    const start = offsetInSquares - 1;
    const end: number = qrDataLength - offsetInSquares;
    return { start, end };
};

export const getQRSvg = (
    qr: QRCode.QRCode,
    size: number,
    logoSize: number,
    logoMargin: number,
    radiusOfSquare: number,
) => {
    const qrDataLength: number = qr.modules.size;

    const sizeOfSquare: number = size / qrDataLength;

    const emptyIndexRange: QRItemRange = getEmptyIndexRange(
        size,
        logoSize,
        logoMargin,
        sizeOfSquare,
        qrDataLength,
    );

    const qrData: number[][] = new Array(qrDataLength)
        .fill(null)
        .map((_: null, index: number): number[] => {
            return qr.modules.data.slice(
                index * qrDataLength,
                (index + 1) * qrDataLength,
            );
        })
        .map((row: number[], y: number): number[] => {
            return row.map((value: number, x: number): number => {
                if (
                    x > emptyIndexRange.start &&
                    x < emptyIndexRange.end &&
                    y > emptyIndexRange.start &&
                    y < emptyIndexRange.end
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
                    radiusOfSquare,
                )}`;
            }
        }
    }
    return qrSvg;
};
