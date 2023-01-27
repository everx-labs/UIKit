import * as React from 'react';
import { View } from 'react-native';
import { getScreenshot } from './getScreenshot';
import type { QRCodeRef } from '../UIQRCodeView/types';
import type { ScreenshotViewProps } from './types';

export const ScreenshotViewImpl: React.ForwardRefRenderFunction<QRCodeRef, ScreenshotViewProps> = (
    props: ScreenshotViewProps,
    ref,
) => {
    const screenshotRef = React.useRef<View | null>(null);
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

    return <View ref={screenshotRef}>{children}</View>;
};

export const ScreenshotView = React.forwardRef(ScreenshotViewImpl);
