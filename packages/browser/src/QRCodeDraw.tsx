import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
    BubbleQRCode,
} from '@tonlabs/uikit.chats';
import { QRCodeError, useQRCodeValueError } from '@tonlabs/uikit.media';

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

    const error = useQRCodeValueError(data, onError, onSuccess);

    return (
        <View onLayout={onLayout}>
            <BubbleQRCode
                data={data}
                status={status}
                type={ChatMessageType.QRCode}
                onLayout={onLayout}
                firstFromChain
                key="qrcode-draw-bubble"
            />
            {!!prompt && !error && (
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
