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

export const QRCodeDraw = ({
    data,
    status,
    onLayout,
    prompt,
    onDraw,
}: QRCodeDrawMessage) => {
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
    return (
        <View>
            <BubbleQRCode
                data={data}
                status={status}
                type={ChatMessageType.QRCode}
                onLayout={onLayout}
                onError={onError}
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
