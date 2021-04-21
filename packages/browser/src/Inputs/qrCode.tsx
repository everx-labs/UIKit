import * as React from 'react';
import { View } from 'react-native';

import { BubbleActionButton, ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import { UIQRCodeScannerSheet } from '@tonlabs/uikit.hydrogen';
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
        qrCodeVisible: false,
    });

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
                    const address = await message.parseData(e.data);
                    message.onSelect({
                        address,
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
