import * as React from 'react';
import { View } from 'react-native';
import { getScreenshot } from './getScreenshot';
import type { QRCodeRef, ScreenshotViewProps } from '../types';

export const ScreenshotViewImpl: React.ForwardRefRenderFunction<QRCodeRef, ScreenshotViewProps> = (
    props: ScreenshotViewProps,
    ref,
) => {
    const screenshotRef = React.useRef<View | null>(null);

    React.useImperativeHandle(
        ref,
        () => ({
            getPng: (): Promise<string | null> => {
                return getScreenshot(screenshotRef);
            },
        }),
        [screenshotRef],
    );

    return <View ref={screenshotRef}>{props.children}</View>;
};

export const ScreenshotView = React.forwardRef(ScreenshotViewImpl);
