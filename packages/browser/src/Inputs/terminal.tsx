import * as React from 'react';

import {
    ChatMessageType,
    MessageStatus,
    UIChatInput,
} from '@tonlabs/uikit.chats';
import type { OnHeightChange, TerminalMessage, Input } from '../types';

export type TerminalState = {
    visible: boolean;
};

export function terminalReducer() {
    return {
        visible: true,
    };
}

export function getTerminalInput(
    message: TerminalMessage,
    onHeightChange: OnHeightChange,
    state: TerminalState,
): Input {
    return {
        messages: [
            {
                type: ChatMessageType.PlainText,
                text: message.prompt,
                key: 'terminal-input-bubble-prompt',
                status: MessageStatus.Received,
            },
        ],
        input: state.visible && (
            <UIChatInput
                editable
                onSendText={message.onSendText}
                onSendMedia={() => undefined}
                onSendDocument={() => undefined}
                onHeightChange={onHeightChange}
            />
        ),
    };
}
