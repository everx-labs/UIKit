import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uikit.chats';
import type { MenuMessage, OnHeightChange } from '../types';

export function MenuInput({
    onLayout,
    ...message
}: MenuMessage & {
    onHeightChange: OnHeightChange;
}) {
    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="menu-title"
                    text={message.title}
                    status={MessageStatus.Received}
                    firstFromChain
                />
                {message.externalState.answer != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="menu-answer"
                        text={message.externalState.answer}
                        status={MessageStatus.Sent}
                        firstFromChain
                    />
                ) : null}
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="menu-title"
                text={message.title}
                status={MessageStatus.Received}
                firstFromChain
            />
            {message.items.map((item, index) => (
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
                />
            ))}
        </View>
    );
}
