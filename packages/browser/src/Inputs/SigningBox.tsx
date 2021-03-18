import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { SigningBoxMessage } from '../types';
import { UISignaturePicker } from '../UISignaturePicker';

type SigningBoxInternalState = {
    keyInputVisible: boolean;
    pickerVisible: boolean;
};

type SigningBoxAction = {
    type:
        | 'OPEN_KEY_INPUT'
        | 'CLOSE_KEY_INPUT'
        | 'OPEN_SIGNATURE_PICKER'
        | 'CLOSE_SIGNATURE_PICKER';
};

function signingBoxReducer(
    state: SigningBoxInternalState,
    action: SigningBoxAction,
) {
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
    if (action.type === 'OPEN_SIGNATURE_PICKER') {
        return {
            ...state,
            pickerVisible: true,
        };
    }
    if (action.type === 'CLOSE_SIGNATURE_PICKER') {
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

export function SigningBox({ onLayout, ...message }: SigningBoxMessage) {
    const [mainSigningBox, ...restSigningBoxes] = message.signingBoxes;
    const [state, dispatch] = React.useReducer(signingBoxReducer, {
        keyInputVisible: false,
        pickerVisible: false,
    });

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="signing-box-bubble-prompt"
                    text="How would you like to sign?"
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />
                {message.externalState.chosenOption != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="signing-box-bubble-option-answer"
                        text={message.externalState.chosenOption}
                        status={MessageStatus.Sent}
                        firstFromChain
                        lastFromChain={message.externalState.signingBox == null}
                    />
                ) : null}
                {message.externalState.signingBox != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="signing-box-bubble-address-answer"
                        text={message.externalState.signingBox.title}
                        status={MessageStatus.Sent}
                        firstFromChain={
                            message.externalState.chosenOption == null
                        }
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
                key="signing-box-bubble-prompt"
                text={message.prompt || uiLocalized.Browser.SigningBox.Prompt}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            {mainSigningBox != null ? (
                <BubbleActionButton
                    key="signing-box-bubble-main"
                    firstFromChain
                    type={ChatMessageType.ActionButton}
                    status={MessageStatus.Received}
                    text={mainSigningBox.title}
                    onPress={() => {
                        message.onSelect({
                            signingBox: mainSigningBox,
                        });
                    }}
                />
            ) : null}
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="signing-box-bubble-enter-key"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.SigningBox.EnterKey}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_KEY_INPUT',
                    });
                }}
                firstFromChain={message.signingBoxes.length === 0}
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="signing-box-bubble-pick-signature"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.SigningBox.PickSignature}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_SIGNATURE_PICKER',
                    });
                }}
                firstFromChain={message.signingBoxes.length === 0}
            />
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="signing-box-bubble-use-scard"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.SigningBox.UseSecurityCard}
                onPress={async () => {
                    const isSuccessful = await message.onUseSecurityCard();

                    if (!isSuccessful) {
                        return;
                    }

                    message.onSelect({
                        chosenOption:
                            uiLocalized.Browser.SigningBox.UseSecurityCard,
                    });
                }}
                lastFromChain
            />
            <UISignaturePicker
                visible={state.pickerVisible}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_SIGNATURE_PICKER',
                    });
                }}
                onAddSignature={() => {
                    dispatch({
                        type: 'OPEN_KEY_INPUT',
                    });
                }}
                onSelect={(signingBox) => {
                    message.onSelect({
                        chosenOption:
                            uiLocalized.Browser.SigningBox.PickSignature,
                        signingBox,
                    });
                    dispatch({
                        type: 'CLOSE_SIGNATURE_PICKER',
                    });
                }}
                signingBoxes={restSigningBoxes}
            />
        </View>
    );
}
