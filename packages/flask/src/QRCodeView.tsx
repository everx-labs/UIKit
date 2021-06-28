import React from 'react';
import { View } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { UIConstant } from '@tonlabs/uikit.core';
import QRCode from 'qrcode';
// import { UIQRCode } from '../../components'
// import * as qrcodegen from './qrcodegen'
// import * as QrCode from './QrCode'
import Svg, { Path } from 'react-native-svg';

type AngleSide =
    'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft'

type AngleType =
    'Acute' |
    'Obtuse'

const getStartLineType = (angleSide: AngleSide): string => {
    switch (angleSide) {
        case 'TopRight':
            return 'h'
        case 'BottomRight':
            return 'v'
        case 'BottomLeft':
            return 'h-'
        case 'TopLeft':
        default:
            return 'v-'
    }
}

const getEndLineType = (angleSide: AngleSide): string => {
    switch (angleSide) {
        case 'TopRight':
            return 'v'
        case 'BottomRight':
            return 'h-'
        case 'BottomLeft':
            return 'v-'
        case 'TopLeft':
        default:
            return 'h'
    }
}

const getArc = (angleSide: AngleSide, radius: number,): string => {
    switch (angleSide) {
        case 'TopRight':
            return `a${radius},${radius} 0 0 1 ${radius},${radius}`
        case 'BottomRight':
            return `a${radius},${radius} 0 0 1 -${radius},${radius}`
        case 'BottomLeft':
            return `a${radius},${radius} 0 0 1 -${radius},-${radius}`
        case 'TopLeft':
        default:
            return `a${radius},${radius} 0 0 1 ${radius},-${radius}`
    }
}

const drawCorner = (
    sizeOfSquare: number,
    angleSide: AngleSide,
    angleType: AngleType,
    radius: number,
) => {
    const startLineType: string = getStartLineType(angleSide)
    const endLineType: string = getEndLineType(angleSide)
    if (angleType === 'Acute') {
        return `
            ${startLineType}${sizeOfSquare / 2}
            ${endLineType}${sizeOfSquare / 2}
        `
    }
    const arc: string = getArc(angleSide, radius)
    const lineLength: string = `${sizeOfSquare / 2 - radius}`
    return `
        ${startLineType}${lineLength}
        ${arc}
        ${endLineType}${lineLength}
    `
}

const getAngleType = (sideData: SideData, angleSide: AngleSide): AngleType => {
    switch (angleSide) {
        case 'TopRight':
            return sideData.topValue || sideData.rightValue ? 'Acute' : 'Obtuse'
        case 'BottomRight':
            return sideData.bottomValue || sideData.rightValue ? 'Acute' : 'Obtuse'
        case 'BottomLeft':
            return sideData.bottomValue || sideData.leftValue ? 'Acute' : 'Obtuse'
        case 'TopLeft':
        default:
            return sideData.topValue || sideData.leftValue ? 'Acute' : 'Obtuse'
    }
}

type IProps = {
    value: string;
    // getPng?: (base64: string) => void; // returns base64
    // size?: number;
    // logo?: number;
    // logoSize?: number;
    // logoMargin?: number;
    // logoBackgroundColor?: string;
};

type SideData = {
    topValue: number | null,
    rightValue: number | null,
    bottomValue: number | null,
    leftValue: number | null,
}
const RADIUS: number = 2;
const draw = (x: number, y: number, sizeOfSquare: number, sideData: SideData) => {
    const scaledX = x * sizeOfSquare;
    const scaledY = y * sizeOfSquare;

    return `
        M${scaledX + sizeOfSquare / 2},${scaledY}
        ${drawCorner(sizeOfSquare, 'TopRight', getAngleType(sideData, 'TopRight'), RADIUS)}
        ${drawCorner(sizeOfSquare, 'BottomRight', getAngleType(sideData, 'BottomRight'), RADIUS)}
        ${drawCorner(sizeOfSquare, 'BottomLeft', getAngleType(sideData, 'BottomLeft'), RADIUS)}
        ${drawCorner(sizeOfSquare, 'TopLeft', getAngleType(sideData, 'TopLeft'), RADIUS)}
    `;

        // h${sizeOfSquare - 2 * radius}
        // a${radius},${radius} 0 0 1 ${radius},${radius}
        // v${sizeOfSquare - 2 * radius}
        // a${radius},${radius} 0 0 1 -${radius},${radius}
        // h-${sizeOfSquare - 2 * radius}
        // a${radius},${radius} 0 0 1 -${radius},-${radius}
        // v-${sizeOfSquare - 2 * radius}
        // a${radius},${radius} 0 0 1 ${radius},-${radius}
};

const QRCodeView = (props: IProps) => {
    const asd = QRCode.create(props.value, {});
    const widthOfQR: number = asd.modules?.size || 2;
    const size = 300;
    const quietZone = size / widthOfQR;
    // const borderWidth = quietZone
    // const diameter = size * Math.SQRT2
    // const offset = (diameter - size) / 2 + borderWidth

    const qrDataLength = asd.modules.size;
    const qrData: number[][] = new Array(qrDataLength)
        .fill(null)
        .map((_: null, index: number): number[] => {
            return asd.modules.data.slice(
                index * qrDataLength,
                (index + 1) * qrDataLength,
            );
        });

    console.log(qrData);

    let QRsvg = '';
    for (let y = 0; y < qrDataLength; y += 1) {
        for (let x = 0; x < qrDataLength; x += 1) {
            const currentValue: number = qrData[y][x];
            const topValue: number | null = qrData[y - 1] !== undefined ? qrData[y - 1][x] : null;
            const rightValue: number | null = qrData[y][x + 1] !== undefined ? qrData[y][x + 1] : null;
            const bottomValue: number | null = qrData[y + 1] !== undefined ? qrData[y + 1][x] : null;
            const leftValue: number | null = qrData[y][x - 1] !== undefined ? qrData[y][x - 1] : null;
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
                borderRadius: 300,
                // borderWidth: borderWidth * 2,
                shadowRadius: quietZone,
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.2,
                borderWidth: 1,
            }}
        >
            {/* <View
                style={{
                    borderRadius: 160,
                    zIndex: -10,
                    borderWidth,
                    borderColor: 'white',
                    overflow: 'hidden',
                }}
            >
                
                <UIQRCode
                    {...props}
                    value={props.value + props.value}
                    size={diameter}
                    quietZone={quietZone}
                />
            </View>
            <View
                style={{
                    position: 'absolute',
                    top: offset,
                    left: offset,
                }}
            >
                <UIQRCode
                    {...props}
                    size={size}
                    quietZone={quietZone}
                />
            </View> */}
            <Svg width={size} height={size}>
                <Path fill="#000000" d={QRsvg} />
            </Svg>
        </View>
    );
};

export default QRCodeView;
