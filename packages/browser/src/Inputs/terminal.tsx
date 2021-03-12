import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
    UIChatInput,
} from '@tonlabs/uikit.chats';
import { Portal } from '@tonlabs/uikit.hydrogen';

import type { OnHeightChange, TerminalMessage } from '../types';

export function TerminalInput({
    onHeightChange,
    onLayout,
    ...message
}: TerminalMessage & {
    onHeightChange: OnHeightChange;
}) {
    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="terminal-input-bubble-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                />
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="terminal-input-bubble-answer"
                    text={message.externalState.text}
                    status={MessageStatus.Sent}
                    firstFromChain
                    lastFromChain
                />
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="terminal-input-bubble-prompt"
                text={message.prompt}
                status={MessageStatus.Received}
                firstFromChain
            />
            <Portal forId="browser">
                <UIChatInput
                    editable
                    autoFocus
                    menuPlusHidden
                    onSendText={(text) => {
                        message.onSend({
                            text,
                        });
                    }}
                    onSendMedia={() => undefined}
                    onSendDocument={() => undefined}
                    onHeightChange={onHeightChange}
                />
            </Portal>
        </View>
    );
}
