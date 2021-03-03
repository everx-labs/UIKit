import * as React from 'react';

import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import type { OnHeightChange, Input, AmountInputMessage } from '../types';

import { UIAmountInput } from '../UIAmountInput';

export type AmountInputState = {
    visible: boolean;
};

export function amountReducer() {
    return {
        visible: true,
    };
}

export function getAmountInput(
    message: AmountInputMessage,
    state: AmountInputState,
    _dispatch: (action: any) => void,
    onHeightChange: OnHeightChange,
): Input {
    return {
        messages: [
            {
                type: ChatMessageType.PlainText,
                text: message.prompt,
                key: 'amount-input-bubble-prompt',
                status: MessageStatus.Received,
            },
        ],
        input: state.visible && (
            <UIAmountInput
                onSendAmount={message.onSendAmount}
                onHeightChange={onHeightChange}
            />
        ),
    };
}
