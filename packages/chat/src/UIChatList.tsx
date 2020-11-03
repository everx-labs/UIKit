import * as React from "react";
import { Platform, SectionList, View } from "react-native";
import {
    TapGestureHandler,
    ScrollView,
    State as RNGHState,
} from "react-native-gesture-handler";
import { Animated } from "react-native-reanimated";

import { UIConstant } from "@uikit/core";

import { sectionListGetItemLayout } from "./UIChatListLayout";
import type { ChatMessage } from "./types";

type RNGHEvent<T> = { nativeEvent: T };

type Props = {
    areStickersVisible: boolean;
    onLoadEarlierMessages(): void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
};

const onHandlerStateChange = ({
    nativeEvent: { state },
}: RNGHEvent<{ state: RNGHState }>) => {
    if (state === RNGHState.ACTIVE) {
        UICustomKeyboardUtils.dismiss();
    }
};

// Apply overflowY style for web to make the scrollbar appear as an overlay
// thus not affecting the content width of SectionList to prevent layout issues
const style = Platform.select({ web: { overflowY: "overlay" } });

// TODO: proper type of the item
const keyExtractor = (item: ChatMessage) => {
    return item.key;
};

const renderBubble = (message: ChatMessage) => {
    switch (message.type) {
        case ChatMessageType.PlainText:
            return <BubblePlainText />;
        case ChatMessageType.System:
            return <BubbleSystem />;
        case ChatMessageType.Transaction:
            return <BubbleTransaction />;
        case ChatMessageType.TransactionComment:
            return <BubbleTransactionComment />;
        case ChatMessageType.Image:
            return <BubbleImage />;
        case ChatMessageType.Document:
            return <BubbleDocument />;
        case ChatMessageType.Sticker:
            return <BubbleSticker />;
        case ChatMessageType.ActionButton:
            return <BubbleActionButton />;
        default:
            return null;
    }
};

const renderItem = (onLayoutCell) => ({ item }: { item: ChatMessage }) => {
    // TODO: do we need to wrap it somehow?
    return (
        <View onLayout={(e) => onLayoutCell(item.key, e)}>
            {renderBubble(item)}
        </View>
    );
};

const renderSectionTitle = ({ section }: { section: { title: string } }) => {
    return <DateSeparator title={title} />;
};

export const UIChatList = React.forwardRef((props: Props, ref) => {
    const keyboardDismissProp = React.useMemo(() => {
        if (Platform.OS !== "ios") {
            // The following is not working on Android >>>
            // See https://github.com/facebook/react-native/issues/23364
            return "on-drag";

            // This can be used as a workaround >>>>
            // onScrollBeginDrag: () => {
            //     Keyboard.dismiss();
            //     UICustomKeyboardUtils.dismiss();
            // },
        }
        if (props.areStickersVisible) {
            return "none"; // `interactive` doesn't work well with UICustomKeyboard :(
        }
        return "interactive";
    }, [props.areStickersVisible]);

    const cellHeight = React.useRef(new Map());

    const getItemLayout = React.useCallback(
        sectionListGetItemLayout({
            getItemHeight: (rowData, sectionIndex, rowIndex) => {
                return cellsHeight.current.get(rowData.key) || 0;
            },
            getSectionFooterHeight: (sectionIndex: number) => {
                return (
                    UIConstant.smallCellHeight() +
                    UIConstant.contentOffset() * 2
                );
            },
            listFooterHeight: () => {
                if (!this.store.canLoadMore) {
                    return 0;
                }
                return (
                    UIConstant.smallCellHeight() +
                    UIConstant.contentOffset() * 2
                );
            },
        })
    );
    const listSize = React.useRef({ height: 0 });
    const contentHeight = React.useRef(0);
    const listContentOffset = React.useRef({ y: 0 });

    const topOpacity = React.useRef(new Animated.Value(0)); // TODO: is it 0?

    const linesAnimationInProgress = React.useRef(false);
    const linesIsShown = React.useRef(false);
    // TODO: how to use it without re-creating on every re-render?
    const showLinesAnimation = React.useRef(
        Animated.spring(topOpacity.current, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        })
    );
    const hideLinesAnimation = React.useRef(
        Animated.spring(topOpacity.current, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        })
    );

    const checkVisualStyle = React.useCallback(() => {
        if (
            !listSize.current ||
            !contentHeight.current ||
            !listContentOffset.current
        ) {
            // Not ready to animate as there are some missing variables to make calculations
            return;
        }

        if (linesAnimationInProgress.current) {
            // Do not calculate (& animate) as the animation is already in process
            return;
        }

        const hasScroll =
            listContentOffset.current && listContentOffset.current.y > 1;
        const hasHeight = listSize.current && listSize.current.height > 0;
        const hasOverflow = contentHeight.current > listSize.current?.height;

        const shouldLinesBeShown = hasScroll || (hasHeight && hasOverflow);

        if (shouldLinesBeShown === linesIsShown.current) {
            return;
        }

        linesAnimationInProgress.current = true;
        const animation = shouldLinesBeShown
            ? showLinesAnimation
            : hideLinesAnimation;
        animation.start(() => {
            linesAnimationInProgress.current = false;
            linesIsShown.current = shouldLinesBeShown;

            checkVisualStyle();
        });
    }, []);
    const onLayout = React.useCallback((e: any) => {
        listSize.current = e.nativeEvent.layout;

        checkVisualStyle();
    }, []);
    const onContentSizeChange = React.useCallback(
        (_width: number, height: number) => {
            // Save the content height in state
            contentHeight.current = height;

            checkVisualStyle();
        },
        []
    );
    const onScrollMessages = React.useCallback((e: any) => {
        listContentOffset.current = e.nativeEvent.contentOffset;

        checkVisualStyle();
    }, []);
    const onLayoutCell = React.useCallback((key: string, e: any) => {
        const { nativeEvent } = e;
        if (nativeEvent) {
            const { layout } = nativeEvent;
            cellsHeight.current.set(key, layout.height);
        }
    }, []);
    const renderItemInternal = React.useCallback(renderItem(onLayoutCell), []);
    const renderLoadMore = React.useCallback(() => {
        if (!props.canLoadMore) {
            return null;
        }

        return (
            <UILoadMoreButton
                onLoadMore={props.onLoadEarlierMessages}
                isLoadingMore={props.isLoadingMore}
            />
        );
    }, []);

    return (
        <TapGestureHandler
            onHandlerStateChange={onHandlerStateChange}
            enabled={props.areStickersVisible}
        >
            <SectionList
                nativeID={CHAT_SECTION_LIST}
                testID="chat_container"
                {...keyboardDismissProp}
                contentInset={contentInset}
                scrollIndicatorInsets={contentInset}
                ref={ref}
                inverted
                getItemLayout={getItemLayout}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onScroll={onScrollMessages}
                // TODO: need to properly deal with log
                // onScrollToIndexFailed={(info) =>
                //     log.error("Failed to scroll to index:", info)
                // }
                scrollEventThrottle={UIConstant.maxScrollEventThrottle()}
                style={style}
                contentContainerStyle={styles.messagesList}
                // sections={(this.store.sections: any[])}
                onViewableItemsChanged={checkVisualStyle}
                keyExtractor={keyExtractor}
                renderItem={renderItemInternal}
                // Because the List is inverted in order to render from the bottom,
                // the title (date) for each section becomes the footer instead of header.
                renderSectionFooter={renderSectionTitle}
                // renderSectionHeader={section => this.renderSectionStatus(section)}
                onEndReached={props.onLoadEarlierMessages}
                onEndReachedThreshold={0.6}
                ListFooterComponent={renderLoadMore}
                renderScrollComponent={(scrollProps) => (
                    <ScrollView {...scrollProps} />
                )}
            />
        </TapGestureHandler>
    );
});
