import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
    UIChatInput,
} from '@tonlabs/uistory.chats';
import { Portal } from '@tonlabs/uikit.layout';

import type { TerminalMessage } from '../types';
import { useUIBrowserInputOnHeightChange } from '../UIBrowserInputHeight';

function TerminalInputContainer({ onSendText }: { onSendText: (text: string) => void }) {
    const onHeightChange = useUIBrowserInputOnHeightChange();

    return (
        <UIChatInput
            editable
            autoFocus
            menuPlusHidden
            onSendText={onSendText}
            onSendMedia={() => undefined}
            onSendDocument={() => undefined}
            managedScrollViewNativeID="browserList"
            onHeightChange={onHeightChange}
        />
    );
}

export function TerminalInput({ onLayout, ...message }: TerminalMessage) {
    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                {!!message.prompt && (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="terminal-input-bubble-prompt"
                        text={message.prompt}
                        status={MessageStatus.Received}
                        firstFromChain
                    />
                )}
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
            {!!message.prompt && (
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="terminal-input-bubble-prompt"
                    text={message.prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                />
            )}
            <Portal forId="browser">
                <TerminalInputContainer
                    onSendText={(text: string) => {
                        message.onSend({
                            text,
                        });
                    }}
                />
            </Portal>
        </View>
    );
}
