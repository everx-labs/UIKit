import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
    BubbleQRCode,
} from '@tonlabs/uikit.chats';
import { QRCodeError } from '@tonlabs/uikit.flask';

import { QRCodeDrawMessage, QRCodeDrawMessageStatus } from './types';

const convertQRCodeErrorToQRCodeDrawMessageStatus = (
    error: QRCodeError,
): QRCodeDrawMessageStatus => {
    switch (error) {
        case QRCodeError.DataTooLong:
        default:
            return QRCodeDrawMessageStatus.DataTooLong;
    }
};

const useOnErrorCallback = (onError: ((error: QRCodeError) => void) | undefined) => {
    const [bubbleQrCodeError, setQrCodeViewError] = React.useState<QRCodeError | null>(null);
    const onErrorCallback = React.useCallback(
        (error: QRCodeError): void => {
            setQrCodeViewError(error);
            if (onError) {
                onError(error);
            }
        },
        [onError],
    );

    return {
        bubbleQrCodeError,
        onErrorCallback,
    };
};

export const QRCodeDraw = ({ data, status, onLayout, prompt, onDraw }: QRCodeDrawMessage) => {
    const onError = React.useCallback(
        (error: QRCodeError) => {
            if (onDraw) {
                onDraw(convertQRCodeErrorToQRCodeDrawMessageStatus(error));
            }
        },
        [onDraw],
    );
    const onSuccess = React.useCallback(() => {
        if (onDraw) {
            onDraw(QRCodeDrawMessageStatus.Success);
        }
    }, [onDraw]);

    const { bubbleQrCodeError, onErrorCallback } = useOnErrorCallback(onError);

    if (bubbleQrCodeError !== null) {
        return null;
    }

    return (
        <View>
            <BubbleQRCode
                data={data}
                status={status}
                type={ChatMessageType.QRCode}
                onLayout={onLayout}
                onError={onErrorCallback}
                onSuccess={onSuccess}
                firstFromChain
                key="qrcode-draw-bubble"
            />
            {!!prompt && (
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="qrcode-draw-bubble-prompt"
                    text={prompt}
                    status={MessageStatus.Received}
                />
            )}
        </View>
    );
};
