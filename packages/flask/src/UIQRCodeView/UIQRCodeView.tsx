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

export const useQRCodeValueError = (
    value: string,
    onError: ((error: QRCodeError) => void) | undefined,
    onSuccess: (() => void) | undefined,
): QRCodeError | null => {
    const error: QRCodeError | null = React.useMemo(() => {
        if (value.length === 0) {
            return QRCodeError.DataIsEmpty;
        }
        if (value.length > UIConstant.qrCode.maxValueLength) {
            return QRCodeError.DataTooLong;
        }
        return null;
    }, [value]);

    React.useEffect(() => {
        if (error) {
            onError && onError(error);
        } else {
            onSuccess && onSuccess();
        }
    }, [error, onError, onSuccess]);

    return error;
};

export const UIQRCodeViewImpl: React.ForwardRefRenderFunction<QRCodeRef, QRCodeProps> = (
    props: QRCodeProps,
    ref: React.ForwardedRef<QRCodeRef>,
) => {
    const { onError, onSuccess } = props;
    const error = useQRCodeValueError(props.value, onError, onSuccess);

    if (error !== null) {
        return null;
    }
    return <ScreenshotView ref={ref}>{renderContent(props)}</ScreenshotView>;
};

export const UIQRCodeView = React.forwardRef(UIQRCodeViewImpl);
