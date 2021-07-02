import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ColorVariants, useTheme, makeStyles } from '@tonlabs/uikit.hydrogen';
import QRCode from 'qrcode';
import { useLogoRender } from './QRCodePure';
import { getEmptyAreaIndexRange, draw, getQRSvg } from './utils';
import type { QRItemRange, QRCodeProps } from '../types';

const DEFAULT_SIZE: number = 200;
const BORDER_WIDTH: number = 16;
const RADIUS_OF_SQUARE: number = 1;
const QUIET_ZONE_IN_SQUARES: number = 1;

const useStyles = makeStyles((theme, size: number) => ({
    container: {
        borderRadius: size,
        height: size,
        width: size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderColor: theme[ColorVariants.BackgroundPrimary],
        overflow: 'hidden',
        borderWidth: BORDER_WIDTH,
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

const getQrDataLength = (
    diameterOfCircleQRCode: number,
    sizeOfSquare: number,
) => {
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
    quietZone: number,
    sizeOfSquare: number,
) => {
    const qrDataLength: number = getQrDataLength(
        diameterOfCircleQRCode,
        sizeOfSquare,
    );
    /**
     * The part of the square that did not fit into the QRSvgCirlce
     * due to the alignment in the center of the QR code
     */
    const offsetOfCoordinateGrid =
        (diameterOfCircleQRCode - qrDataLength * sizeOfSquare) / 2;

    const emptyAreaIndexRange: QRItemRange = getEmptyAreaIndexRange(
        qrDataLength * sizeOfSquare,
        sizeOfInnerQRCode,
        quietZone,
        sizeOfSquare,
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
                    RADIUS_OF_SQUARE,
                    offsetOfCoordinateGrid,
                )}`;
            }
        }
    }
    return qrSvg;
};

export const QRCodeCircle: React.FC<QRCodeProps> = ({
    size = DEFAULT_SIZE,
    value,
    logoSize = 40,
    logoMargin = 0,
    logo,
    logoBackgroundColor = ColorVariants.BackgroundPrimary,
}: QRCodeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme, size);

    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const widthOfInnerQRCodeInSquares: number = qr.modules?.size || 2;
    const diameterOfCircleQRCode = size - BORDER_WIDTH * 2;
    const sizeOfInnerQRCode = diameterOfCircleQRCode / Math.SQRT2;
    const sizeOfSquare = sizeOfInnerQRCode / widthOfInnerQRCodeInSquares;
    const quietZone = QUIET_ZONE_IN_SQUARES * sizeOfSquare;

    const qrSvg = React.useMemo(
        () =>
            getQRSvg(
                qr,
                sizeOfInnerQRCode,
                logoSize,
                logoMargin,
                RADIUS_OF_SQUARE,
            ),
        [qr, sizeOfInnerQRCode, logoSize, logoMargin],
    );

    const qrSvgOuter = React.useMemo(
        () =>
            getQRSvgCirlce(
                diameterOfCircleQRCode,
                sizeOfInnerQRCode,
                quietZone,
                sizeOfSquare,
            ),
        [diameterOfCircleQRCode, sizeOfInnerQRCode, quietZone, sizeOfSquare],
    );

    const logoRender = useLogoRender(
        logo,
        logoSize,
        logoMargin,
        theme[logoBackgroundColor] as string,
    );

    return (
        <View style={styles.container}>
            <View style={styles.qrCodeContainer}>
                <View style={styles.outerQrCodeContainer}>
                    <Svg
                        width={diameterOfCircleQRCode}
                        height={diameterOfCircleQRCode}
                    >
                        <Path
                            fill={
                                theme[
                                    ColorVariants.BackgroundPrimaryInverted
                                ] as string
                            }
                            d={qrSvgOuter}
                        />
                    </Svg>
                </View>
                <Svg width={sizeOfInnerQRCode} height={sizeOfInnerQRCode}>
                    <Path
                        fill={
                            theme[
                                ColorVariants.BackgroundPrimaryInverted
                            ] as string
                        }
                        d={qrSvg}
                    />
                </Svg>
            </View>
            {logoRender}
        </View>
    );
};
