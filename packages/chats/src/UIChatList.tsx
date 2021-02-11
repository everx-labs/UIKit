import * as React from 'react';
import { SectionList } from 'react-native';
import type { SectionListData } from 'react-native';

import { SectionExtra, UIChatListFormatter } from './UIChatListFormatter';
import { UILoadMoreButton } from './UILoadMoreButton';
import { UICommonChatList } from './UICommonChatList';
import { DateSeparator } from './DateSeparator';
import type { ChatMessage } from './types';
import { sectionListGetItemLayout } from './UIChatListLayout';

const renderSectionTitle = ({
    section,
}: {
    section: SectionListData<ChatMessage, SectionExtra>;
}) => {
    if (section.time == null) {
        return null;
    }

    return <DateSeparator time={section.time} />;
};

type UIChatListProps = {
    messages: ChatMessage[];
    canLoadMore: boolean;
    isLoadingMore: boolean;
    onLoadEarlierMessages: () => void;
    isCustomKeyboardVisible?: boolean;
    bottomInset?: number;
};

export const UIChatList = React.forwardRef<SectionList, UIChatListProps>(
    function UIChatListContainer(
        {
            messages,
            canLoadMore,
            isLoadingMore,
            onLoadEarlierMessages,
            isCustomKeyboardVisible,
            bottomInset,
        }: UIChatListProps,
        ref,
    ) {
        const renderLoadMore = React.useCallback(() => {
            if (!canLoadMore) {
                return null;
            }

            return (
                <UILoadMoreButton
                    onLoadMore={onLoadEarlierMessages}
                    isLoadingMore={isLoadingMore}
                />
            );
        }, [canLoadMore, onLoadEarlierMessages, isLoadingMore]);

        const sections = React.useMemo(
            () => UIChatListFormatter.getSections(messages),
            [messages],
        );

        return (
            <UICommonChatList
                ref={ref}
                nativeID="chatSectionList"
                getItemLayoutFabric={sectionListGetItemLayout}
                isCustomKeyboardVisible={isCustomKeyboardVisible}
                canLoadMore={canLoadMore}
                bottomInset={bottomInset}
            >
                {(chatListProps) => (
                    <SectionList
                        testID="chat_container"
                        sections={sections}
                        // Because the List is inverted in order to render from the bottom,
                        // the title (date) for each section becomes the footer instead of header.
                        renderSectionFooter={renderSectionTitle}
                        // renderSectionHeader={section => this.renderSectionStatus(section)}
                        onEndReached={onLoadEarlierMessages}
                        ListFooterComponent={renderLoadMore}
                        {...chatListProps}
                    />
                )}
            </UICommonChatList>
        );
    },
);
