import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { MenuMessage } from '../types';

const ITEMS_TO_FOLD_COUNT = 5;

export function MenuInput({ onLayout, ...message }: MenuMessage) {
    const [unfolded, setUnfolded] = React.useState(false);

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="menu-title"
                    text={message.title}
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="menu-answer"
                    text={message.items[message.externalState.chosenIndex].title}
                    status={MessageStatus.Sent}
                    firstFromChain
                    lastFromChain
                />
            </View>
        );
    }

    const items = unfolded ? message.items : message.items.slice(0, ITEMS_TO_FOLD_COUNT);

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="menu-title"
                text={message.title}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            {items.map((item, index) => (
                <BubbleActionButton
                    type={ChatMessageType.ActionButton}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`menu-item-${item.handlerId}-${index}`}
                    text={item.title}
                    status={MessageStatus.Received}
                    onPress={() => {
                        // handlerId it's actually an identifier of an external function,
                        // for menu item it can be the same handler, so we pass index to it,
                        // to identify what menu item was chosen
                        message.onSelect({
                            chosenHandlerId: item.handlerId,
                            chosenIndex: index,
                        });
                    }}
                    firstFromChain={index === 0}
                    lastFromChain={unfolded && index === message.items.length - 1}
                />
            ))}
            {!unfolded && message.items.length > ITEMS_TO_FOLD_COUNT && (
                <BubbleActionButton
                    type={ChatMessageType.ActionButton}
                    key="menu-more"
                    text={uiLocalized.Browser.Menu.More}
                    status={MessageStatus.Received}
                    onPress={() => {
                        setUnfolded(true);
                    }}
                    lastFromChain
                />
            )}
        </View>
    );
}
