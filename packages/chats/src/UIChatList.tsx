import * as React from 'react';
import { SectionList, ViewProps } from 'react-native';
import type { SectionListData } from 'react-native';

import { SectionExtra, UIChatListFormatter } from './UIChatListFormatter';
import { UILoadMoreButton } from './UILoadMoreButton';
import { UICommonChatList } from './UICommonChatList';
import { DateSeparator } from './DateSeparator';
import { ChatMessage, ChatMessageType, OnPressUrl, OnLongPressText } from './types';
import { sectionListGetItemLayout } from './UIChatListLayout';
import { BubbleChatPlainText } from './BubblePlainText';
import { BubbleSystem } from './BubbleSystem';
import { BubbleTransaction } from './BubbleTransaction';
import { BubbleImage } from './BubbleImage';
import { BubbleDocument } from './BubbleDocument';
import { BubbleSticker } from './BubbleSticker';
import { BubbleActionButton } from './BubbleActionButton';
import { ChatBubbleQRCode } from './BubbleQRCode';
import { ChatBubbleMedia } from './BubbleMedia/BubbleMedia';

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

const renderBubble = (
    message: ChatMessage,
    onLayout: ViewProps['onLayout'],
) => {
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
    bottomInset?: number;
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
                forwardRef={ref}
                nativeID={nativeID}
                renderBubble={renderBubble}
                getItemLayoutFabric={sectionListGetItemLayout}
                canLoadMore={canLoadMore}
                onLongPressText={onLongPressText}
                onPressUrl={onPressUrl}
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
