import * as React from 'react';
import { View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';
import { useScreenshotRef } from './hooks';
import type { QRCodeProps } from '../types';

const renderContent = (props: QRCodeProps) => {
    switch (props.type) {
        case 'Circle':
            return <QRCodeCircle {...props} />;
        case 'Default':
        default:
            return <QRCodeSquare {...props} />;
    }
};

export const UIQRCodeView: React.FC<QRCodeProps> = (props: QRCodeProps) => {
    const { getPng, value } = props;

    const screenshotRef = useScreenshotRef(value, getPng);

    return (
        <ViewShot
            ref={screenshotRef}
            options={{ format: 'png', result: 'base64' }}
        >
            <View nativeID={`uri-qr-${props.value}`}>
                {renderContent(props)}
            </View>
        </ViewShot>
    );
};
