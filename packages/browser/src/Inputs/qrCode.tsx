import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    BubbleActionButton,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import { UIQRCodeScannerSheet } from '@tonlabs/uikit.navigation';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { QRCodeMessage } from '../types';

type QRCodeInternalState = {
    qrCodeVisible: boolean;
};

type QRCodeAction = {
    type:
        | 'OPEN_QR_CODE'
        | 'CLOSE_QR_CODE';
};

function qrCodeReducer(
    state: QRCodeInternalState,
    action: QRCodeAction,
) {
    if (action.type === 'OPEN_QR_CODE') {
        return {
            ...state,
            qrCodeVisible: true,
        };
    }
    if (action.type === 'CLOSE_QR_CODE') {
        return {
            ...state,
            qrCodeVisible: false,
        };
    }
    return {
        qrCodeVisible: false,
    };
}

export function QRCode({
    onLayout,
    ...message
}: QRCodeMessage) {
    const [state, dispatch] = React.useReducer(qrCodeReducer, {
        qrCodeVisible: message.fastScan || false,
    });

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="qr-code-bubble-answer"
                    text={message.externalState.value}
                    status={MessageStatus.Sent}
                    firstFromChain
                    lastFromChain
                />
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleActionButton
                firstFromChain
                key="qr-code-message-bubble"
                type={ChatMessageType.ActionButton}
                status={MessageStatus.Received}
                text={uiLocalized.Browser.AddressInputBubble.ScanQR}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_QR_CODE',
                    });
                }}
            />
            <UIQRCodeScannerSheet
                visible={state.qrCodeVisible}
                onRead={async (e: any) => {
                    const value = await message.parseData(e.data);
                    message.onScan({
                        value,
                    });
                    dispatch({
                        type: 'CLOSE_QR_CODE',
                    });
                }}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_QR_CODE',
                    });
                }}
            />
        </View>
    );
}
