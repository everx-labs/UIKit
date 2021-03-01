import * as React from 'react';
import { FlatList, FlatListProps } from 'react-native';

import {
    UICommonChatList,
    BubbleSimplePlainText,
    BubbleActionButton,
    ChatMessageType,
    CommonChatListProps,
} from '@tonlabs/uikit.chats';
import { BrowserMessageType, VisibleMessage } from './types';
import { getFormattedList } from './getFormattedList';
import {
    BubbleConfirmButtons,
    BubbleConfirmDeclined,
    BubbleConfirmSuccessful,
} from './BubbleConfirm';

type UIBrowserListProps = {
    messages: VisibleMessage[];
    bottomInset?: number;
};

function flatListGetItemLayoutFabric({
    getItemHeight,
}: {
    getItemHeight: (rowData?: any, rowIndex?: number) => number;
}): Required<FlatListProps<VisibleMessage>>['getItemLayout'] {
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

function renderBubble(item: VisibleMessage) {
    if (item.type === ChatMessageType.PlainText) {
        return <BubbleSimplePlainText {...item} />;
    }
    if (item.type === ChatMessageType.ActionButton) {
        return <BubbleActionButton {...item} />;
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

    return null;
}

export const UIBrowserList = React.forwardRef<FlatList, UIBrowserListProps>(
    function UIBrowserListForwarded(
        { messages, bottomInset }: UIBrowserListProps,
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
                renderBubble={renderBubble}
                getItemLayoutFabric={flatListGetItemLayoutFabric}
                bottomInset={bottomInset}
            >
                {(chatListProps: CommonChatListProps<VisibleMessage>) => (
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
