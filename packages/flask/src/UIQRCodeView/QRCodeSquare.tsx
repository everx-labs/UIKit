import * as React from 'react';
import { View } from 'react-native';
import { QRCodePure } from './QRCodePure';

type IProps = {
    value: string;
    size?: number;
    getPng?: (base64: string) => void; // returns base64
    logo?: number;
    logoSize?: number;
    logoMargin?: number;
    logoBackgroundColor?: string;
};

export const QRCodeSquare = (props: IProps) => {
    return (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
            }}
        >
            <QRCodePure {...props} />
        </View>
    );
};
