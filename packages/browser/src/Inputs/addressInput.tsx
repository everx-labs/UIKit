import * as React from 'react';

import { UIQRCodeScannerSheet } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { ChatMessageStatus, ChatMessageType } from '@tonlabs/uikit.chats';

import { InteractiveMessageType } from '../types';
import type { ValidateAddress, OnHeightChange, Input } from '../types';
import { UIAddressInput } from '../UIAddressInput';

export type AddressInputState = {
    inputVisible: boolean;
    qrCodeVisible: boolean;
    addressSelectionVisible: boolean;
};

export type AddressInputAction = {
    type:
        | 'OPEN_ADDRESS_INPUT'
        | 'OPEN_QR_CODE'
        | 'CLOSE_QR_CODE'
        | 'OPEN_ADDRESS_SELECTION'
        | 'CLOSE_ADDRESS_SELECTION';
};

export function addressInputReducer(
    _state: AddressInputState,
    action: AddressInputAction,
) {
    if (action.type === 'OPEN_ADDRESS_INPUT') {
        return {
            inputVisible: true,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'OPEN_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: true,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'CLOSE_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'OPEN_ADDRESS_SELECTION') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: true,
        };
    }
    if (action.type === 'CLOSE_ADDRESS_SELECTION') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    return {
        inputVisible: false,
        qrCodeVisible: false,
        addressSelectionVisible: false,
    };
}

export type AddressInputMessage = {
    type: InteractiveMessageType.AddressInput;
    onSelect: (selectedButtonText: string, address: string) => void;
    mainAddress: string;
    input: {
        validateAddress: ValidateAddress;
    };
    qrCode: {
        parseData: (data: any) => string;
    };
};

export function getAddressInput(
    message: AddressInputMessage,
    state: AddressInputState,
    dispatch: (action: AddressInputAction) => void,
    onHeightChange: OnHeightChange,
): Input {
    return {
        messages: [
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.AddressInputBubble.ScanQR,
                key: 'address-input-bubble-action-qr',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    dispatch({
                        type: 'OPEN_QR_CODE',
                    });
                },
            },
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.AddressInputBubble.EnterManually,
                key: 'address-input-bubble-action-enter',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    dispatch({
                        type: 'OPEN_ADDRESS_INPUT',
                    });
                },
            },
            // {
            //     type: ChatMessageType.ActionButton,
            //     text: uiLocalized.Browser.AddressInputBubble.SelectAsset,
            //     key: 'address-input-bubble-select-assets',
            //     status: ChatMessageStatus.Received,
            //     time: Date.now(),
            //     sender: 'system',
            //     onPress: () => {
            //         dispatch({
            //             type: 'OPEN_ADDRESS_SELECTION',
            //         });
            //     },
            // },
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.AddressInputBubble.MainAccount,
                key: 'address-input-bubble-action-account',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    message.onSelect(
                        uiLocalized.Browser.AddressInputBubble.MainAccount,
                        message.mainAddress,
                    );
                },
            },
            {
                type: ChatMessageType.PlainText,
                text: uiLocalized.Browser.AddressInputBubble.Question,
                key: 'address-input-bubble',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
            },
        ],
        input: (
            <>
                {state.inputVisible && (
                    <UIAddressInput
                        onSendText={(addr) => {
                            message.onSelect(
                                uiLocalized.Browser.AddressInputBubble
                                    .EnterManually,
                                addr,
                            );
                        }}
                        onHeightChange={onHeightChange}
                        validateAddress={message.input.validateAddress}
                    />
                )}
            </>
        ),
    };
}

export function getAddressInputShared(
    message: AddressInputMessage | any,
    state: AddressInputState,
    dispatch: (action: AddressInputAction) => void,
) {
    return (
        <UIQRCodeScannerSheet
            key={InteractiveMessageType.AddressInput}
            visible={state.qrCodeVisible}
            onRead={(e: any) => {
                const mes = message as AddressInputMessage;
                mes.onSelect(
                    uiLocalized.Browser.AddressInputBubble.ScanQR,
                    mes.qrCode.parseData(e.data),
                );
            }}
            onClose={() => {
                dispatch({
                    type: 'CLOSE_QR_CODE',
                });
            }}
        />
    );
}
