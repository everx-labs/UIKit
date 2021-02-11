import * as React from 'react';
import { FlatList, FlatListProps } from 'react-native';

import { UICommonChatList } from '@tonlabs/uikit.chats';
import type { ChatMessage, CommonChatListProps } from '@tonlabs/uikit.chats';

type UIBrowserListProps = {
    messages: ChatMessage[];
    bottomInset?: number;
};

function flatListGetItemLayoutFabric({
    getItemHeight,
}: {
    getItemHeight: (rowData?: any, rowIndex?: number) => number;
}): Required<FlatListProps<ChatMessage>>['getItemLayout'] {
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

export function UIBrowserList(props: UIBrowserListProps) {
    return (
        <UICommonChatList
            nativeID="browserList"
            bottomInset={props.bottomInset}
            getItemLayoutFabric={flatListGetItemLayoutFabric}
        >
            {(chatListProps: CommonChatListProps) => (
                <FlatList
                    testID="browser_container"
                    data={props.messages}
                    {...chatListProps}
                />
            )}
        </UICommonChatList>
    );
}
