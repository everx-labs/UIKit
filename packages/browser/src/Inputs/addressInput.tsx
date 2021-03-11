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

type AddressInputInternalState = {
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
    state: AddressInputInternalState,
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

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="address-input-bubble-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                />
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="address-input-bubble-option-answer"
                    text={message.externalState.chosenOption}
                    status={MessageStatus.Sent}
                    firstFromChain
                />
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="address-input-bubble-address-answer"
                    text={message.externalState.address}
                    status={MessageStatus.Sent}
                    lastFromChain
                />
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
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
                    message.onSelect({
                        chosenOption:
                            uiLocalized.Browser.AddressInputBubble.MainAccount,
                        address: message.mainAddress,
                    });
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
                        onSendText={(address) => {
                            message.onSelect({
                                chosenOption:
                                    uiLocalized.Browser.AddressInputBubble
                                        .EnterManually,
                                address,
                            });
                            dispatch({
                                type: 'CLOSE_ADDRESS_INPUT',
                            });
                        }}
                        onHeightChange={onHeightChange}
                        validateAddress={message.input.validateAddress}
                    />
                </Portal>
            )}
            <UIQRCodeScannerSheet
                visible={state.qrCodeVisible}
                onRead={async (e: any) => {
                    const address = await message.qrCode.parseData(e.data);
                    message.onSelect({
                        chosenOption:
                            uiLocalized.Browser.AddressInputBubble.ScanQR,
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
            <UIAccountPicker
                visible={state.addressSelectionVisible}
                onSelect={(address) => {
                    message.onSelect({
                        chosenOption:
                            uiLocalized.Browser.AddressInputBubble.SelectAsset,
                        address,
                    });
                    dispatch({
                        type: 'CLOSE_ADDRESS_SELECTION',
                    });
                }}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_ADDRESS_SELECTION',
                    });
                }}
                sections={message.select || []}
            />
        </View>
    );
}
