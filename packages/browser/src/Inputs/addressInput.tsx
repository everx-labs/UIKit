import * as React from 'react';
import { View } from 'react-native';

import { Portal, UIQRCodeScannerSheet } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    MessageStatus,
    ChatMessageType,
    BubbleSimplePlainText,
    BubbleActionButton,
} from '@tonlabs/uikit.chats';

import type { AddressInputMessage, OnHeightChange } from '../types';
import { UIAddressInput } from '../UIAddressInput';
import { UIAccountPicker } from '../UIAccountPicker';

type AddressInputState = {
    inputVisible: boolean;
    qrCodeVisible: boolean;
    addressSelectionVisible: boolean;
};

type AddressInputAction = {
    type:
        | 'OPEN_ADDRESS_INPUT'
        | 'CLOSE_ADDRESS_INPUT'
        | 'OPEN_QR_CODE'
        | 'CLOSE_QR_CODE'
        | 'OPEN_ADDRESS_SELECTION'
        | 'CLOSE_ADDRESS_SELECTION';
};

function addressInputReducer(
    state: AddressInputState,
    action: AddressInputAction,
) {
    if (action.type === 'OPEN_ADDRESS_INPUT') {
        return {
            ...state,
            inputVisible: true,
        };
    }
    if (action.type === 'CLOSE_ADDRESS_INPUT') {
        return {
            ...state,
            inputVisible: false,
        };
    }
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
    if (action.type === 'OPEN_ADDRESS_SELECTION') {
        return {
            ...state,
            addressSelectionVisible: true,
        };
    }
    if (action.type === 'CLOSE_ADDRESS_SELECTION') {
        return {
            ...state,
            addressSelectionVisible: false,
        };
    }
    return {
        inputVisible: false,
        qrCodeVisible: false,
        addressSelectionVisible: false,
    };
}

export function AddressInput({
    onHeightChange,
    onLayout,
    ...message
}: AddressInputMessage & {
    onHeightChange: OnHeightChange;
}) {
    const [state, dispatch] = React.useReducer(addressInputReducer, {
        inputVisible: false,
        qrCodeVisible: false,
        addressSelectionVisible: false,
    });

    return (
        <View key={message.key} onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="address-input-bubble-prompt"
                text={message.prompt}
                status={MessageStatus.Received}
                firstFromChain
            />
            <BubbleActionButton
                key="address-input-bubble-action-account"
                firstFromChain
                type={ChatMessageType.ActionButton}
                status={MessageStatus.Received}
                text={uiLocalized.Browser.AddressInputBubble.MainAccount}
                onPress={() => {
                    // message.onSelect(
                    //     uiLocalized.Browser.AddressInputBubble.MainAccount,
                    //     message.mainAddress,
                    // );
                }}
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="address-input-bubble-select-assets"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.AddressInputBubble.SelectAsset}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_ADDRESS_SELECTION',
                    });
                }}
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="address-input-bubble-action-enter"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.AddressInputBubble.EnterManually}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_ADDRESS_INPUT',
                    });
                }}
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="address-input-bubble-action-qr"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.AddressInputBubble.ScanQR}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_QR_CODE',
                    });
                }}
            />
            {state.inputVisible && (
                <Portal forId="browser">
                    <UIAddressInput
                        onSendText={
                            (/* addr */) => {
                                // message.onSelect(
                                //     uiLocalized.Browser.AddressInputBubble
                                //         .EnterManually,
                                //     addr,
                                // );
                                dispatch({
                                    type: 'CLOSE_ADDRESS_INPUT',
                                });
                            }
                        }
                        onHeightChange={onHeightChange}
                        validateAddress={message.input.validateAddress}
                    />
                </Portal>
            )}
            <Portal forId="browser">
                <UIQRCodeScannerSheet
                    visible={state.qrCodeVisible}
                    onRead={
                        async (/* e: any */) => {
                            // const mes = message as AddressInputMessage;
                            // mes.onSelect(
                            //     uiLocalized.Browser.AddressInputBubble.ScanQR,
                            //     await mes.qrCode.parseData(e.data),
                            // );
                            dispatch({
                                type: 'CLOSE_QR_CODE',
                            });
                        }
                    }
                    onClose={() => {
                        dispatch({
                            type: 'CLOSE_QR_CODE',
                        });
                    }}
                />
                <UIAccountPicker
                    visible={state.addressSelectionVisible}
                    onSelect={
                        (/* address */) => {
                            // const mes = message as AddressInputMessage;
                            // mes.onSelect(
                            //     uiLocalized.Browser.AddressInputBubble.SelectAsset,
                            //     address,
                            // );
                            dispatch({
                                type: 'CLOSE_ADDRESS_SELECTION',
                            });
                        }
                    }
                    onClose={() => {
                        dispatch({
                            type: 'CLOSE_ADDRESS_SELECTION',
                        });
                    }}
                    sections={message.select || []}
                />
            </Portal>
        </View>
    );
}
