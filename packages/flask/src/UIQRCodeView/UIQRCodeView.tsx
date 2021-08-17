import * as React from 'react';
import { QRCodeCircle } from './QRCodeCircle';
import { QRCodeSquare } from './QRCodeSquare';
import { QRCodeType, QRCodeError } from '../types';
import type { QRCodeProps, QRCodeRef } from '../types';
import { ScreenshotView } from '../ScreenshotView';
import { UIConstant } from '../constants';

const renderContent = (props: QRCodeProps) => {
    switch (props.type) {
        case QRCodeType.Circle:
            return <QRCodeCircle {...props} />;
        case QRCodeType.Square:
        default:
            return <QRCodeSquare {...props} />;
    }
};

const useValueError = (value: string): QRCodeError | null => {
    return React.useMemo(() => {
        if (value.length === 0) {
            return QRCodeError.DataIsEmpty;
        }
        if (value.length > UIConstant.qrCode.maxValueLength) {
            return QRCodeError.DataTooLong;
        }
        return null;
    }, [value]);
};

export const UIQRCodeViewImpl: React.ForwardRefRenderFunction<QRCodeRef, QRCodeProps> = (
    props: QRCodeProps,
    ref,
) => {
    const { onError, onSuccess } = props;
    const valueError = useValueError(props.value);
    React.useEffect(() => {
        if (valueError) {
            onError && onError(valueError);
        } else {
            onSuccess && onSuccess();
        }
    }, [valueError, onError, onSuccess]);

    if (valueError !== null) {
        return null;
    }
    return <ScreenshotView ref={ref}>{renderContent(props)}</ScreenshotView>;
};

export const UIQRCodeView = React.forwardRef(UIQRCodeViewImpl);
