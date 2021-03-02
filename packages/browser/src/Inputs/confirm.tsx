import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import { BrowserMessageType, ConfirmMessage, Input } from '../types';

export type ConfirmState = null;

export function getConfirmInput(message: ConfirmMessage): Input {
    return {
        messages: [
            {
                type: BrowserMessageType.ConfirmButtons,
                onSuccess: () => {
                    message.onConfirm(true);
                },
                onDecline: () => {
                    message.onConfirm(false);
                },
                key: 'confirm-buttons',
                status: MessageStatus.Received,
            },
            {
                type: ChatMessageType.PlainText,
                text: message.prompt,
                key: 'confirm-prompt',
                status: MessageStatus.Received,
            },
        ],
        input: null,
    };
}
