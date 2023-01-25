import * as React from 'react';
import type { ViewProps, SectionListData, SectionList, Insets } from 'react-native';

import { UILoadMoreButton } from '@tonlabs/uikit.controls';
import { sectionListGetItemLayout } from '@tonlabs/uikit.scrolls';

import { SectionExtra, UIChatListFormatter } from './UIChatListFormatter';
import { UICommonChatList } from './UICommonChatList';
import { DateSeparator } from './DateSeparator';
import { BubbleChatPlainText } from './BubblePlainText';
import { BubbleSystem } from './BubbleSystem';
import { BubbleTransaction } from './BubbleTransaction';
import { BubbleImage } from './BubbleImage';
import { BubbleDocument } from './BubbleDocument';
import { BubbleSticker } from './BubbleSticker';
import { BubbleActionButton } from './BubbleActionButton';
import { ChatBubbleQRCode } from './BubbleQRCode';
import { ChatBubbleMedia } from './BubbleMedia/BubbleMedia';
import { ChatMessageType } from './constants';
import type { ChatMessage, OnPressUrl, OnLongPressText } from './types';
import { UIChatSectionList } from './UIChatSectionList';

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

const renderBubble = (message: ChatMessage, onLayout: ViewProps['onLayout']) => {
    switch (message.type) {
        case ChatMessageType.PlainText:
            return <BubbleChatPlainText {...message} onLayout={onLayout} />;
        case ChatMessageType.System:
            return <BubbleSystem {...message} onLayout={onLayout} />;
        case ChatMessageType.Transaction:
            return <BubbleTransaction {...message} onLayout={onLayout} />;
        case ChatMessageType.Image:
            return <BubbleImage {...message} />;
        case ChatMessageType.Document:
            return <BubbleDocument {...message} />;
        case ChatMessageType.Sticker:
            return <BubbleSticker {...message} onLayout={onLayout} />;
        case ChatMessageType.ActionButton:
            return <BubbleActionButton {...message} onLayout={onLayout} />;
        case ChatMessageType.QRCode:
            return <ChatBubbleQRCode {...message} onLayout={onLayout} />;
        case ChatMessageType.Media:
            return <ChatBubbleMedia {...message} onLayout={onLayout} />;
        default:
            return null;
    }
};

type UIChatListProps = {
    nativeID: string;
    messages: ChatMessage[];
    canLoadMore: boolean;
    isLoadingMore: boolean;
    onLoadEarlierMessages: () => void;
    onPressUrl?: OnPressUrl;
    onLongPressText?: OnLongPressText;
    shouldAutoHandleInsets: boolean;
    contentInset?: Insets;
};

export const UIChatList = React.forwardRef<SectionList, UIChatListProps>(
    function UIChatListContainer(
        {
            nativeID,
            messages,
            canLoadMore,
            isLoadingMore,
            onLoadEarlierMessages,
            onPressUrl,
            onLongPressText,
            shouldAutoHandleInsets,
            contentInset,
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

        const sections = React.useMemo(() => UIChatListFormatter.getSections(messages), [messages]);

        return (
            <UICommonChatList
                forwardRef={ref}
                nativeID={nativeID}
                renderBubble={renderBubble}
                getItemLayoutFabric={sectionListGetItemLayout}
                canLoadMore={canLoadMore}
                onLongPressText={onLongPressText}
                onPressUrl={onPressUrl}
                shouldAutoHandleInsets={shouldAutoHandleInsets}
            >
                {({ ...chatListProps }) => (
                    <UIChatSectionList
                        testID="chat_container"
                        sections={sections}
                        // Because the List is inverted in order to render from the bottom,
                        // the title (date) for each section becomes the footer instead of header.
                        renderSectionFooter={renderSectionTitle}
                        // renderSectionHeader={section => this.renderSectionStatus(section)}
                        onEndReached={onLoadEarlierMessages}
                        ListFooterComponent={renderLoadMore}
                        contentInset={contentInset}
                        {...chatListProps}
                    />
                )}
            </UICommonChatList>
        );
    },
);
