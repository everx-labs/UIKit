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
            ...message.items.map(
                (item, index): ActionButtonMessage => ({
                    type: ChatMessageType.ActionButton,
                    text: item.title,
                    key: `menu-item-${item.handlerId}-${index}`,
                    status: MessageStatus.Received,
                    onPress: () => {
                        // handlerId it's actually an identifier of an external function,
                        // for menu item it can be the same handler, so we pass index to it,
                        // to identify what menu item was chosen
                        message.onSelect(item.handlerId, index);
                    },
                }),
            ).reverse(),
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
