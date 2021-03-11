import * as React from 'react';
import { FlatList, FlatListProps, ViewProps } from 'react-native';

import {
    UICommonChatList,
    BubbleSimplePlainText,
    BubbleActionButton,
    ChatMessageType,
    CommonChatListProps,
} from '@tonlabs/uikit.chats';
import {
    BrowserMessage,
    BrowserMessageType,
    InteractiveMessageType,
    OnHeightChange,
} from './types';
import { getFormattedList } from './getFormattedList';
import {
    BubbleConfirmButtons,
    BubbleConfirmDeclined,
    BubbleConfirmSuccessful,
} from './BubbleConfirm';
import { AddressInput } from './Inputs/addressInput';
import { TerminalInput } from './Inputs/terminal';

type UIBrowserListProps = {
    messages: BrowserMessage[];
    bottomInset?: number;
    onHeightChange: OnHeightChange;
};

function flatListGetItemLayoutFabric({
    getItemHeight,
}: {
    getItemHeight: (rowData?: any, rowIndex?: number) => number;
}): Required<FlatListProps<BrowserMessage>>['getItemLayout'] {
    return (data, index) => {
        if (data == null) {
            return {
                length: 0,
                offset: 0,
                index,
            };
        }

        return {
            length: getItemHeight(data),
            offset: getItemHeight(data),
            index,
        };
    };
}

const renderBubble = (onHeightChange: OnHeightChange) => (
    item: BrowserMessage,
    onLayout: ViewProps['onLayout'],
) => {
    if (item.type === ChatMessageType.PlainText) {
        return <BubbleSimplePlainText {...item} onLayout={onLayout} />;
    }
    if (item.type === ChatMessageType.ActionButton) {
        return <BubbleActionButton {...item} onLayout={onLayout} />;
    }
    if (item.type === BrowserMessageType.ConfirmSuccessful) {
        return <BubbleConfirmSuccessful />;
    }
    if (item.type === BrowserMessageType.ConfirmDeclined) {
        return <BubbleConfirmDeclined />;
    }
    if (item.type === BrowserMessageType.ConfirmButtons) {
        return <BubbleConfirmButtons {...item} />;
    }

    if (item.type === InteractiveMessageType.AddressInput) {
        return (
            <AddressInput
                {...item}
                onHeightChange={onHeightChange}
                onLayout={onLayout}
            />
        );
    }
    if (item.type === InteractiveMessageType.Terminal) {
        return (
            <TerminalInput
                {...item}
                onHeightChange={onHeightChange}
                onLayout={onLayout}
            />
        );
    }

    return null;
};

export const UIBrowserList = React.forwardRef<FlatList, UIBrowserListProps>(
    function UIBrowserListForwarded(
        { messages, bottomInset, onHeightChange }: UIBrowserListProps,
        ref,
    ) {
        const formattedMessages = React.useMemo(
            () => getFormattedList(messages),
            [messages],
        );
        return (
            <UICommonChatList
                forwardRef={ref}
                nativeID="browserList"
                renderBubble={renderBubble(onHeightChange)}
                getItemLayoutFabric={flatListGetItemLayoutFabric}
                bottomInset={bottomInset}
            >
                {(chatListProps: CommonChatListProps<BrowserMessage>) => (
                    <FlatList
                        testID="browser_container"
                        data={formattedMessages}
                        {...chatListProps}
                    />
                )}
            </UICommonChatList>
        );
    },
);
