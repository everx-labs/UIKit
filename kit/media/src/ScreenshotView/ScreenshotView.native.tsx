import * as React from 'react';
import ViewShot from 'react-native-view-shot';
import { getScreenshot } from './getScreenshot';
import type { QRCodeRef } from '../UIQRCodeView/types';
import type { ScreenshotViewProps } from './types';

export const ScreenshotViewImpl: React.ForwardRefRenderFunction<QRCodeRef, ScreenshotViewProps> = (
    props: ScreenshotViewProps,
    ref,
) => {
    const screenshotRef = React.useRef<ViewShot | null>(null);

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
        <ViewShot ref={screenshotRef} options={{ format: 'png', result: 'base64' }}>
            {props.children}
        </ViewShot>
    );
};

export const ScreenshotView = React.forwardRef(ScreenshotViewImpl);
