import {
    ActionButtonMessage,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import type { MenuMessage, Input } from '../types';

export type MenuState = null;

export function getMenuInput(message: MenuMessage): Input {
    return {
        messages: [
            ...message.items.reverse().map(
                (item): ActionButtonMessage => ({
                    type: ChatMessageType.ActionButton,
                    text: item.title,
                    key: `menu-item-${item.handlerId}`,
                    status: MessageStatus.Received,
                    onPress: () => {
                        message.onSelect(item.handlerId);
                    },
                }),
            ),
            {
                type: ChatMessageType.PlainText,
                text: message.title,
                key: 'menu-title',
                status: MessageStatus.Received,
            },
        ],
        input: null,
    };
}
