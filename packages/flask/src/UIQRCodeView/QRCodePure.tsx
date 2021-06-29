import * as React from 'react';
import QRCode from 'qrcode';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import { UIImage, ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';

const RADIUS: number = 1;
const DEFAULT_SIZE: number = 200;
const DEFAULT_LOGO_SIZE: number = 40;

type AngleSide = 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft';

type AngleType = 'Acute' | 'Obtuse';

const getStartLineType = (angleSide: AngleSide): string => {
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

const getEndLineType = (angleSide: AngleSide): string => {
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

const getArc = (angleSide: AngleSide, radius: number): string => {
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
    angleSide: AngleSide,
    angleType: AngleType,
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

const getAngleType = (sideData: SideData, angleSide: AngleSide): AngleType => {
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

type IProps = {
    value: string;
    size?: number;
    getPng?: (base64: string) => void; // returns base64
    logo?: number;
    logoSize?: number;
    logoMargin?: number;
    logoBackgroundColor?: string;
};

type SideData = {
    topValue: number | null;
    rightValue: number | null;
    bottomValue: number | null;
    leftValue: number | null;
};

const draw = (
    x: number,
    y: number,
    sizeOfSquare: number,
    sideData: SideData,
) => {
    const scaledX = x * sizeOfSquare;
    const scaledY = y * sizeOfSquare;

    return `
        M${scaledX + sizeOfSquare / 2},${scaledY}
        ${drawCorner(
            sizeOfSquare,
            'TopRight',
            getAngleType(sideData, 'TopRight'),
            RADIUS,
        )}
        ${drawCorner(
            sizeOfSquare,
            'BottomRight',
            getAngleType(sideData, 'BottomRight'),
            RADIUS,
        )}
        ${drawCorner(
            sizeOfSquare,
            'BottomLeft',
            getAngleType(sideData, 'BottomLeft'),
            RADIUS,
        )}
        ${drawCorner(
            sizeOfSquare,
            'TopLeft',
            getAngleType(sideData, 'TopLeft'),
            RADIUS,
        )}
    `;
};

const renderLogo = (
    logo: number | undefined,
    logoSize: number | undefined = DEFAULT_LOGO_SIZE,
    logoMargin: number | undefined,
    logoBackgroundColor: string | undefined = 'white',
): React.ReactElement<View> | null => {
    if (logo) {
        return (
            <View
                style={{
                    padding: logoMargin,
                    backgroundColor: logoBackgroundColor,
                }}
            >
                <UIImage
                    source={logo}
                    style={{
                        width: logoSize,
                        height: logoSize,
                    }}
                />
            </View>
        );
    }
    return null;
};

export const QRCodePure: React.FC<IProps> = ({
    size = DEFAULT_SIZE,
    value,
    logo,
    logoSize,
    logoMargin,
    logoBackgroundColor,
}: IProps) => {
    const theme = useTheme();
    const qr = QRCode.create(value, {});

    const qrDataLength = qr.modules.size;
    const qrData: number[][] = new Array(qrDataLength)
        .fill(null)
        .map((_: null, index: number): number[] => {
            return qr.modules.data.slice(
                index * qrDataLength,
                (index + 1) * qrDataLength,
            );
        });

    let QRsvg = '';
    for (let y = 0; y < qrDataLength; y += 1) {
        for (let x = 0; x < qrDataLength; x += 1) {
            const currentValue: number = qrData[y][x];
            const topValue: number | null =
                qrData[y - 1] !== undefined ? qrData[y - 1][x] : null;
            const rightValue: number | null =
                qrData[y][x + 1] !== undefined ? qrData[y][x + 1] : null;
            const bottomValue: number | null =
                qrData[y + 1] !== undefined ? qrData[y + 1][x] : null;
            const leftValue: number | null =
                qrData[y][x - 1] !== undefined ? qrData[y][x - 1] : null;
            if (currentValue === 1) {
                QRsvg += ` ${draw(x, y, size / qrDataLength, {
                    topValue,
                    rightValue,
                    bottomValue,
                    leftValue,
                })}`;
            }
        }
    }

    return (
        <View
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: size,
                width: size,
            }}
        >
            <View
                style={StyleSheet.absoluteFillObject}
                nativeID={`uri-qr-${value}`}
            >
                <Svg width={size} height={size}>
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
            {renderLogo(logo, logoSize, logoMargin, logoBackgroundColor)}
        </View>
    );
};
