import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    BubbleActionButton,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uistory.chats';
import { UIQRCodeScannerSheet } from '@tonlabs/uikit.navigation';
import { uiLocalized } from '@tonlabs/localization';

import type { QRCodeScannerMessage } from '../types';

type QRCodeScannerInternalState = {
    qrCodeScannerVisible: boolean;
};

type QRCodeScannerAction = {
    type: 'OPEN_QR_CODE' | 'CLOSE_QR_CODE';
};

function qrCodeScannerReducer(state: QRCodeScannerInternalState, action: QRCodeScannerAction) {
    if (action.type === 'OPEN_QR_CODE') {
        return {
            ...state,
            qrCodeScannerVisible: true,
        };
    }
    if (action.type === 'CLOSE_QR_CODE') {
        return {
            ...state,
            qrCodeScannerVisible: false,
        };
    }
    return {
        qrCodeScannerVisible: false,
    };
}

export function QRCodeScanner({ onLayout, ...message }: QRCodeScannerMessage) {
    const [state, dispatch] = React.useReducer(qrCodeScannerReducer, {
        qrCodeScannerVisible: message.fastScan || false,
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
            {!!message.prompt && (
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="qr-code-message-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                />
            )}
            <BubbleActionButton
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
                visible={state.qrCodeScannerVisible}
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
