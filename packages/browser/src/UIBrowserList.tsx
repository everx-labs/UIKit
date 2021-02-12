import * as React from 'react';
import { FlatList, FlatListProps } from 'react-native';

import {
    UICommonChatList,
    BubbleSimplePlainText,
    BubbleActionButton,
    ChatMessageType,
    CommonChatListProps,
} from '@tonlabs/uikit.chats';
import type { VisibleMessage } from './types';

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

    return null;
}

export const UIBrowserList = React.forwardRef<FlatList, UIBrowserListProps>(
    function UIBrowserListForwarded(props: UIBrowserListProps, ref) {
        return (
            <UICommonChatList
                forwardRef={ref}
                nativeID="browserList"
                renderBubble={renderBubble}
                getItemLayoutFabric={flatListGetItemLayoutFabric}
                bottomInset={props.bottomInset}
            >
                {(chatListProps: CommonChatListProps<VisibleMessage>) => (
                    <FlatList
                        testID="browser_container"
                        data={props.messages}
                        {...chatListProps}
                    />
                )}
            </UICommonChatList>
        );
    },
);
