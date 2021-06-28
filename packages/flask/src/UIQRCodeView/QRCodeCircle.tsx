import * as React from 'react';
import { View, StyleSheet } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { UIConstant } from '@tonlabs/uikit.core';
import QRCode from 'qrcode';
import { QRCodePure } from './QRCodePure';

const DEFAULT_SIZE: number = 200;

type IProps = {
    value: string;
    getPng?: (base64: string) => void; // returns base64
    size?: number;
    logo?: number;
    logoSize?: number;
    logoMargin?: number;
    logoBackgroundColor?: string;
};

export const QRCodeCircle = (props: IProps) => {
    const asd = QRCode.create(props.value, {});
    const widthOfQR: number = asd.modules?.size || 2;
    const size = props.size !== undefined ? props.size : DEFAULT_SIZE;
    const quietZone = size / widthOfQR;
    const borderWidth = quietZone;
    const diameter = size * Math.SQRT2;

    return (
        <View
            style={{
                borderRadius: diameter,
                height: diameter + borderWidth * 2,
                width: diameter + borderWidth * 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderWidth,
                borderColor: 'white',
                overflow: 'hidden',
            }}
        >
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    zIndex: -10,
                }}
            >
                <QRCodePure value={props.value + props.value} size={diameter} />
            </View>
            <View
                style={{
                    backgroundColor: 'white',
                    borderWidth: quietZone,
                    borderColor: 'white',
                }}
            >
                <QRCodePure {...props} value={props.value} size={size} />
            </View>
        </View>
    );
};
