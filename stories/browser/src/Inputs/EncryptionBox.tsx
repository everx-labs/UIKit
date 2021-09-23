import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uistory.chats';
import { uiLocalized } from '@tonlabs/localization';

import type { EncryptionBoxMessage } from '../types';
import { UIBoxPicker } from '../UIBoxPicker';
import { UIKeySheet } from '../UIKeySheet';

type EncryptionBoxInternalState = {
    keyInputVisible: boolean;
    pickerVisible: boolean;
};

type EncryptionBoxAction = {
    type: 'OPEN_KEY_INPUT' | 'CLOSE_KEY_INPUT' | 'OPEN_PICKER' | 'CLOSE_PICKER';
};

function encryptionBoxReducer(state: EncryptionBoxInternalState, action: EncryptionBoxAction) {
    if (action.type === 'OPEN_KEY_INPUT') {
        return {
            ...state,
            keyInputVisible: true,
        };
    }
    if (action.type === 'CLOSE_KEY_INPUT') {
        return {
            ...state,
            keyInputVisible: false,
        };
    }
    if (action.type === 'OPEN_PICKER') {
        return {
            ...state,
            pickerVisible: true,
        };
    }
    if (action.type === 'CLOSE_PICKER') {
        return {
            ...state,
            pickerVisible: false,
        };
    }

    return {
        keyInputVisible: false,
        pickerVisible: false,
    };
}

export function EncryptionBox({ onLayout, ...message }: EncryptionBoxMessage) {
    const [mainEncryptionBox, ...restEncryptionBoxes] = message.encryptionBoxes;
    const [state, dispatch] = React.useReducer(encryptionBoxReducer, {
        keyInputVisible: false,
        pickerVisible: false,
    });

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="encryption-box-bubble-prompt"
                    text={message.prompt || uiLocalized.Browser.EncryptionBox.Prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />
                {message.externalState.chosenOption != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="encryption-box-bubble-option-answer"
                        text={message.externalState.chosenOption}
                        status={MessageStatus.Sent}
                        firstFromChain
                        lastFromChain={message.externalState.encryptionBox == null}
                    />
                ) : null}
                {message.externalState.encryptionBox != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="encryption-box-bubble-address-answer"
                        text={message.externalState.encryptionBox.title}
                        status={MessageStatus.Sent}
                        firstFromChain={message.externalState.chosenOption == null}
                        lastFromChain
                    />
                ) : null}
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="encryption-box-bubble-prompt"
                text={message.prompt || uiLocalized.Browser.EncryptionBox.Prompt}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            {mainEncryptionBox != null ? (
                <BubbleActionButton
                    key="encryption-box-bubble-main"
                    firstFromChain
                    type={ChatMessageType.ActionButton}
                    status={MessageStatus.Received}
                    text={mainEncryptionBox.title}
                    onPress={() => {
                        message.onSelect({
                            encryptionBox: mainEncryptionBox,
                        });
                    }}
                />
            ) : null}
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="encryption-box-bubble-enter-key"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.EncryptionBox.EnterKey}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_KEY_INPUT',
                    });
                }}
                firstFromChain={message.encryptionBoxes.length === 0}
            />
            {message.encryptionBoxes.length > 1 && (
                <BubbleActionButton
                    type={ChatMessageType.ActionButton}
                    key="encryption-box-bubble-pick-cipher"
                    status={MessageStatus.Received}
                    text={uiLocalized.Browser.EncryptionBox.PickCipher}
                    onPress={() => {
                        dispatch({
                            type: 'OPEN_PICKER',
                        });
                    }}
                    firstFromChain={message.encryptionBoxes.length === 0}
                />
            )}
            <UIBoxPicker
                visible={state.pickerVisible}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_PICKER',
                    });
                }}
                onAdd={() => {
                    dispatch({
                        type: 'OPEN_KEY_INPUT',
                    });
                }}
                onSelect={encryptionBox => {
                    message.onSelect({
                        chosenOption: uiLocalized.Browser.EncryptionBox.PickCipher,
                        encryptionBox,
                    });
                    dispatch({
                        type: 'CLOSE_PICKER',
                    });
                }}
                boxes={restEncryptionBoxes}
                headerTitle={uiLocalized.Browser.EncryptionBox.CipherKeys}
                addTitle={uiLocalized.Browser.EncryptionBox.AddCipherKey}
            />
            <UIKeySheet
                visible={state.keyInputVisible}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_KEY_INPUT',
                    });
                }}
                onKeyRetrieved={async (key: string) => {
                    const encryptionBox = await message.onAddEncryptionBox(key);

                    message.onSelect({
                        chosenOption: uiLocalized.Browser.EncryptionBox.EnterKey,
                        encryptionBox,
                    });

                    dispatch({
                        type: 'CLOSE_KEY_INPUT',
                    });
                }}
                label={uiLocalized.Browser.EncryptionBox.CipherKeyLabel}
            />
        </View>
    );
}
