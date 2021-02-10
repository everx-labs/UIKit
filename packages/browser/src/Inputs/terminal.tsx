import * as React from 'react';

import { UIChatInput } from '@tonlabs/uikit.chats';
import type {
    OnHeightChange,
    OnSendText,
    InteractiveMessageType,
    Input,
} from '../types';

export type TerminalMessage = {
    type: InteractiveMessageType.Terminal;
    onSendText: OnSendText;
};

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
        messages: [],
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
