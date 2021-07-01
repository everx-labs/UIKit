import * as React from 'react';
import { View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';
import { getScreenshot } from './hooks';
import type { QRCodeProps, QRCodeRef } from '../types';

const renderContent = (props: QRCodeProps) => {
    switch (props.type) {
        case 'Circle':
            return <QRCodeCircle {...props} />;
        case 'Default':
        default:
            return <QRCodeSquare {...props} />;
    }
};

export const UIQRCodeViewImpl: React.ForwardRefRenderFunction<
    QRCodeRef,
    QRCodeProps
> = (props: QRCodeProps, ref) => {
    const { value } = props;
    const screenshotRef = React.useRef<ViewShot | null>(null);

    const screenId = `uri-qr-${value}`;

    React.useImperativeHandle(
        ref,
        () => ({
            getPng: (): Promise<string> => {
                return getScreenshot(screenId, screenshotRef);
            },
        }),
        [screenId, screenshotRef],
    );

    return (
        <ViewShot
            ref={screenshotRef}
            options={{ format: 'png', result: 'base64' }}
        >
            <View nativeID={screenId} testID={props.testID}>
                {renderContent(props)}
            </View>
        </ViewShot>
    );
};

export const UIQRCodeView = React.forwardRef(UIQRCodeViewImpl);
