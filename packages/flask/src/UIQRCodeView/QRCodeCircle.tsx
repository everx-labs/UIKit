import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import QRCode from 'qrcode';
import { renderLogo } from './QRCodePure';
import { getEmptyIndexRange, draw, getQRSvg } from './utils';
import type { QRItemRange, QRCodeProps } from '../types';

const DEFAULT_SIZE: number = 200;
const BORDER_WIDTH: number = 16;
const RADIUS_OF_SQUARE: number = 1;

export const getQRSvgCirlce = (
    qr: QRCode.QRCode,
    size: number,
    logoSize: number,
    logoMargin: number,
) => {
    const qrDataLength: number = Math.floor(qr.modules.size * Math.SQRT2);

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
        .map((): number[] => {
            return new Array(qrDataLength).fill(null).map(() => {
                return Math.random() > 0.5 ? 1 : 0;
            });
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

    let QRsvg = '';
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
                QRsvg += ` ${draw(
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
                )}`;
            }
        }
    }
    return QRsvg;
};

export const QRCodeCircle: React.FC<QRCodeProps> = ({
    size = DEFAULT_SIZE,
    value,
    logoSize = 40,
    logoMargin = 0,
    logo,
    logoBackgroundColor,
}: QRCodeProps) => {
    const theme = useTheme();

    const qr = React.useMemo(() => QRCode.create(value, {}), [value]);
    const widthOfQR: number = qr.modules?.size || 2;
    const diameterOfCircleQRCode = size - BORDER_WIDTH * 2;
    const sizeOfInnerQRCode = diameterOfCircleQRCode / Math.SQRT2;
    const quietZone = sizeOfInnerQRCode / widthOfQR;

    const QRsvg = getQRSvg(
        qr,
        sizeOfInnerQRCode,
        logoSize,
        logoMargin,
        RADIUS_OF_SQUARE,
    );

    const QRsvgOuter = React.useMemo(
        () =>
            getQRSvgCirlce(
                qr,
                diameterOfCircleQRCode,
                sizeOfInnerQRCode,
                quietZone,
            ),
        [qr, diameterOfCircleQRCode, sizeOfInnerQRCode, quietZone],
    );

    return (
        <View
            style={{
                borderRadius: size,
                height: size,
                width: size,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme[ColorVariants.BackgroundPrimary],
                borderColor: theme[ColorVariants.BackgroundPrimary],
                overflow: 'hidden',
                borderWidth: BORDER_WIDTH,
            }}
        >
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        zIndex: -10,
                    }}
                >
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
                            d={QRsvgOuter}
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
                        d={QRsvg}
                    />
                </Svg>
            </View>
            {renderLogo(
                logo,
                logoSize,
                logoMargin,
                logoBackgroundColor,
                theme[ColorVariants.BackgroundPrimaryInverted] as string,
            )}
        </View>
    );
};
