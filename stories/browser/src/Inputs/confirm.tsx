import * as React from 'react';
import { View } from 'react-native';

import { BubbleSimplePlainText, ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import type { ConfirmMessage } from '../types';
import {
    BubbleConfirmButtons,
    BubbleConfirmDeclined,
    BubbleConfirmSuccessful,
} from '../BubbleConfirm';

export function ConfirmInput({ onLayout, ...message }: ConfirmMessage) {
    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="confirm-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                />
                {message.externalState.isConfirmed ? (
                    <BubbleConfirmSuccessful />
                ) : (
                    <BubbleConfirmDeclined />
                )}
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="confirm-prompt"
                text={message.prompt}
                status={MessageStatus.Received}
                firstFromChain
            />
            <BubbleConfirmButtons
                onSuccess={() => {
                    message.onConfirm({
                        isConfirmed: true,
                    });
                }}
                onDecline={() => {
                    message.onConfirm({
                        isConfirmed: false,
                    });
                }}
            />
        </View>
    );
}
