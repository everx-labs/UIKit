import * as React from "react";
import {
    Platform,
    SectionList,
    View,
    StyleSheet,
    Animated,
} from "react-native";
import {
    TapGestureHandler,
    ScrollView,
    State as RNGHState,
} from "react-native-gesture-handler";

import { UIConstant } from "@tonlabs/uikit.core";

import { sectionListGetItemLayout } from "./UIChatListLayout";
import { UIChatListFormatter } from "./UIChatListFormatter";
import type { Section } from "./UIChatListFormatter";
import { ChatMessageType } from "./types";
import type { ChatMessage } from "./types";
import { BubblePlainText } from "./BubblePlainText";
import { BubbleSystem } from "./BubbleSystem";
import { BubbleTransaction } from "./BubbleTransaction";
import { BubbleImage } from "./BubbleImage";
import { BubbleDocument } from "./BubbleDocument";
import { BubbleSticker } from "./BubbleSticker";
import { BubbleActionButton } from "./BubbleActionButton";
import { DateSeparator } from "./DateSeparator";
import { UILoadMoreButton } from "./UILoadMoreButton";

type RNGHEvent<T> = { nativeEvent: T };

type Props = {
    areStickersVisible: boolean;
    onLoadEarlierMessages(): void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
    messages: ChatMessage[];
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

const keyExtractor = (item: ChatMessage) => {
    return item.key;
};

const renderBubble = (message: ChatMessage) => {
    switch (message.type) {
        case ChatMessageType.PlainText:
            return <BubblePlainText {...message} />;
        case ChatMessageType.System:
            return <BubbleSystem {...message} />;
        case ChatMessageType.Transaction:
            return <BubbleTransaction {...message} />;
        case ChatMessageType.Image:
            return <BubbleImage {...message} />;
        case ChatMessageType.Document:
            return <BubbleDocument {...message} />;
        case ChatMessageType.Sticker:
            return <BubbleSticker {...message} />;
        case ChatMessageType.ActionButton:
            return <BubbleActionButton {...message} />;
        default:
            return null;
    }
};

const renderItem = (onLayoutCell: (key: string, e: any) => void) => ({
    item,
}: {
    item: ChatMessage;
}) => {
    return (
        <View
            onLayout={(e) => onLayoutCell(item.key, e)}
            style={{
                // TODO: this one is incorrect, there are different paddings for bubbles
                paddingTop: item.firstFromChain
                    ? UIConstant.smallContentOffset()
                    : 0,
                paddingBottom: item.lastFromChain
                    ? 0
                    : UIConstant.tinyContentOffset(),
            }}
        >
            {renderBubble(item)}
        </View>
    );
};

const renderSectionTitle = ({ section }: { section: Section }) => (
    <DateSeparator time={section.time} />
);

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

    const cellsHeight = React.useRef(new Map());

    const getItemLayout = React.useCallback(
        sectionListGetItemLayout({
            getItemHeight: (rowData: ChatMessage) => {
                return cellsHeight.current.get(rowData.key) || 0;
            },
            getSectionFooterHeight: () => {
                return (
                    UIConstant.smallCellHeight() +
                    UIConstant.contentOffset() * 2
                );
            },
            listFooterHeight: () => {
                if (!props.canLoadMore) {
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

    const topOpacity = React.useRef(new Animated.Value(0));

    const linesAnimationInProgress = React.useRef(false);
    const linesIsShown = React.useRef(false);

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

    // TODO: proper contentInset
    const contentInset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    return (
        <TapGestureHandler
            onHandlerStateChange={onHandlerStateChange}
            enabled={props.areStickersVisible}
        >
            <SectionList
                nativeID="chatSectionList"
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
                sections={UIChatListFormatter.getSections(props.messages)}
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

const styles = StyleSheet.create({
    messagesList: {
        paddingHorizontal: UIConstant.contentOffset(),
        paddingVertical: UIConstant.contentOffset(),
    },
});
