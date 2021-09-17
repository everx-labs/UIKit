import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.hydrogen';
import QRCode from 'qrcode';
import { useLogoRender } from './hooks';
import { getEmptyAreaIndexRange, draw, getQRSvg } from './utils';
import type { QRItemRange, QRCodeProps } from '../types';
import { QR_CODE_ITEM_BORDER_RADIUS, CIRCLE_QR_CODE_QUIET_ZONE_IN_SQUARES } from '../constants';
import { useQRCodeSize } from './hooks/useQRCodeSize';
import { useQRCodeBorderWidth } from './hooks/useQRCodeBorderWidth';
import { useQRCodeLogoSize } from './hooks/useQRCodeLogoSize';

const useStyles = makeStyles((theme, qrCodeSize: number, qrCodeBorderWidth: number) => ({
    container: {
        borderRadius: qrCodeSize / 2 + qrCodeBorderWidth,
        height: qrCodeSize + qrCodeBorderWidth * 2,
        width: qrCodeSize + qrCodeBorderWidth * 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderColor: theme[ColorVariants.BackgroundPrimary],
        overflow: 'hidden',
        borderWidth: qrCodeBorderWidth,
    },
    qrCodeContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerQrCodeContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -10,
    },
}));

const getQrDataLength = (diameterOfCircleQRCode: number, sizeOfSquare: number) => {
    const qrDataLength = diameterOfCircleQRCode / sizeOfSquare;
    const qrDataLengthFloored = Math.floor(qrDataLength);
    if (qrDataLength !== qrDataLengthFloored) {
        if (qrDataLengthFloored % 2 === 0) {
            return qrDataLengthFloored + 1;
        }
        return qrDataLengthFloored + 2;
    }
    return qrDataLengthFloored;
};

export const getQRSvgCirlce = (
    diameterOfCircleQRCode: number,
    sizeOfInnerQRCode: number,
    sizeOfSquare: number,
) => {
    const qrDataLength: number = getQrDataLength(diameterOfCircleQRCode, sizeOfSquare);
    /**
     * The part of the square that did not fit into the QRSvgCirlce
     * due to the alignment in the center of the QR code
     */
    const offsetOfCoordinateGrid = (diameterOfCircleQRCode - qrDataLength * sizeOfSquare) / 2;

    const emptyAreaIndexRange: QRItemRange = getEmptyAreaIndexRange(
        qrDataLength * sizeOfSquare,
        sizeOfInnerQRCode,
        CIRCLE_QR_CODE_QUIET_ZONE_IN_SQUARES,
        sizeOfSquare,
        true,
    );

    const qrData: number[][] = new Array(qrDataLength)
        .fill(null)
        .map((): number[] => {
            return new Array(qrDataLength).fill(null).map(() => {
                return Math.random() > 0.5 ? 1 : 0;
            });
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
                    offsetOfCoordinateGrid,
                )}`;
            }
        }
    }
    return qrSvg;
};

export const QRCodeCircle: React.FC<QRCodeProps> = ({ value, logo, size }: QRCodeProps) => {
    const theme = useTheme();
    const qrCodeSize = useQRCodeSize(size);
    const qrCodeBorderWidth = useQRCodeBorderWidth(size);
    const logoSize = useQRCodeLogoSize(size);

    const styles = useStyles(theme, qrCodeSize, qrCodeBorderWidth);

    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const widthOfInnerQRCodeInSquares: number = qr.modules?.size || 2;
    const diameterOfCircleQRCode = qrCodeSize;
    const sizeOfInnerQRCode = diameterOfCircleQRCode / Math.SQRT2;
    const sizeOfSquare = sizeOfInnerQRCode / widthOfInnerQRCodeInSquares;
    const isThereLogo = logo !== undefined;

    const qrSvg = React.useMemo(
        () => getQRSvg(qr, sizeOfInnerQRCode, logoSize, isThereLogo),
        [qr, sizeOfInnerQRCode, logoSize, isThereLogo],
    );

    const qrSvgOuter = React.useMemo(
        () => getQRSvgCirlce(diameterOfCircleQRCode, sizeOfInnerQRCode, sizeOfSquare),
        [diameterOfCircleQRCode, sizeOfInnerQRCode, sizeOfSquare],
    );

    const logoRender = useLogoRender(logo, size);

    return (
        <View style={styles.container}>
            <View style={styles.qrCodeContainer}>
                <View style={styles.outerQrCodeContainer}>
                    <Svg width={diameterOfCircleQRCode} height={diameterOfCircleQRCode}>
                        <Path
                            fill={theme[ColorVariants.BackgroundPrimaryInverted] as string}
                            d={qrSvgOuter}
                        />
                    </Svg>
                </View>
                <Svg width={sizeOfInnerQRCode} height={sizeOfInnerQRCode}>
                    <Path
                        fill={theme[ColorVariants.BackgroundPrimaryInverted] as string}
                        d={qrSvg}
                    />
                </Svg>
            </View>
            {logoRender}
        </View>
    );
};
