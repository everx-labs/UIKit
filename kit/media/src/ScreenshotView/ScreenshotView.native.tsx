import * as React from 'react';
import ViewShot from 'react-native-view-shot';
import { getScreenshot } from './getScreenshot';
import type { QRCodeRef } from '../UIQRCodeView/types';
import type { ScreenshotViewProps } from './types';

export const ScreenshotView = React.forwardRef<QRCodeRef, ScreenshotViewProps>(
    function ScreenshotView(props: ScreenshotViewProps, ref) {
        const screenshotRef = React.useRef<ViewShot | null>(null);
        const { children } = props;

        React.useImperativeHandle(
            ref,
            () => ({
                getPng: (): Promise<string | null> => {
                    return getScreenshot(screenshotRef);
                },
            }),
            [screenshotRef],
        );

        return (
            // @ts-ignore
            <ViewShot ref={screenshotRef} options={{ format: 'png', result: 'base64' }}>
                {children}
            </ViewShot>
        );
    },
);
