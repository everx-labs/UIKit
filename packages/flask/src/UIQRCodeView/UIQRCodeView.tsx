import * as React from 'react';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';
import type { QRCodeProps, QRCodeRef } from '../types';
import { ScreenshotView } from '../ScreenshotView';

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
    return (
        <ScreenshotView ref={ref}>
            {renderContent(props)}
        </ScreenshotView>
    );
};

export const UIQRCodeView = React.forwardRef(UIQRCodeViewImpl);
