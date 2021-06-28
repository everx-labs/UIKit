import * as React from 'react';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';

type QRCodeType = 'Default' | 'Circle';

type IProps = {
    type: QRCodeType;
    value: string;
    getPng?: (base64: string) => void; // returns base64
    size?: number;
    logo?: number;
    logoSize?: number;
    logoMargin?: number;
    logoBackgroundColor?: string;
};

export const UIQRCodeView = (props: IProps) => {
    switch (props.type) {
        case 'Circle':
            return (
                <QRCodeCircle
                    {...props}
                    value={props.value}
                    size={props.size}
                />
            );
        case 'Default':
        default:
            return (
                <QRCodeSquare
                    {...props}
                    value={props.value}
                    size={props.size}
                />
            );
    }
};
