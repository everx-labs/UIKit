import * as React from 'react';
import ViewShot from 'react-native-view-shot';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';
import { useScreenshotRef } from './hooks';

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

const renderContent = (props: IProps) => {
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

export const UIQRCodeView = (props: IProps) => {
    const { getPng, value } = props;

    const screenshotRef = useScreenshotRef(value, getPng);

    return (
        <ViewShot
            ref={screenshotRef}
            options={{ format: 'png', result: 'base64' }}
        >
            {renderContent(props)}
        </ViewShot>
    );
};
