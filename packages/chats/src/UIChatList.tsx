import * as React from 'react';
import {
    Platform,
    SectionList,
    View,
    StyleSheet,
    Animated,
    SectionListData,
} from 'react-native';
import {
    TapGestureHandler,
    ScrollView,
    State as RNGHState,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '@tonlabs/uikit.core';

import { sectionListGetItemLayout } from './UIChatListLayout';
import { UIChatListFormatter } from './UIChatListFormatter';
import type { SectionExtra } from './UIChatListFormatter';
import { ChatMessageType } from './types';
import type { ChatMessage } from './types';
import { BubblePlainText } from './BubblePlainText';
import { BubbleSystem } from './BubbleSystem';
import { BubbleTransaction } from './BubbleTransaction';
import { BubbleImage } from './BubbleImage';
import { BubbleDocument } from './BubbleDocument';
import { BubbleSticker } from './BubbleSticker';
import { BubbleActionButton } from './BubbleActionButton';
import { DateSeparator } from './DateSeparator';
import { UILoadMoreButton } from './UILoadMoreButton';
import { UICustomKeyboardUtils } from './UICustomKeyboard';

type RNGHEvent<T> = { nativeEvent: T };

const onHandlerStateChange = ({
    nativeEvent: { state },
}: RNGHEvent<{ state: RNGHState }>) => {
    if (state === RNGHState.ACTIVE) {
        UICustomKeyboardUtils.dismiss();
    }
};

// Apply overflowY style for web to make the scrollbar appear as an overlay
// thus not affecting the content width of SectionList to prevent layout issues
const style: any = Platform.select({ web: { overflowY: 'overlay' } });

// Note: `DOMMouseScroll` is commonly used by Firefox!
const wheelEvent =
    // @ts-ignore (can't find onmousewheel on document)
    global.document?.onmousewheel !== undefined
        ? 'mousewheel'
        : 'DOMMouseScroll';

const CHAT_SECTION_LIST = 'chatSectionList';

type WheelEvent = Event & {
    deltaY?: number;
    detail?: number;
};

type ListContentOffset = { y: number };

function useWheelHandler(handler: (e: WheelEvent) => void) {
    React.useEffect(() => {
        if (Platform.OS !== 'web') {
            return;
        }

        window.addEventListener(wheelEvent, handler, { passive: false });

        return () => {
            window.removeEventListener(wheelEvent, handler);
        };
    }, []);
}

function useChatListWheelHandler(
    ref: React.Ref<SectionList>,
    listContentOffsetRef: React.RefObject<ListContentOffset>
) {
    const handler = React.useCallback((e: WheelEvent) => {
        const scroll = document.getElementById(CHAT_SECTION_LIST);
        if (
            scroll == null ||
            e.target == null ||
            ref == null ||
            !('current' in ref)
        ) {
            return;
        }
        // @ts-ignore (contains type doesn't match e.target one)
        const doesContain = scroll.contains(e.target);
        if (doesContain && ref.current) {
            e.preventDefault();
            // Note: e.deltaY is not present for `DOMMouseScroll` event (used by Firefox)
            const factor = e.deltaY ? 1 : 100; // the factor value is chosen heuristically
            const delta = e.deltaY || e.detail || 0; // Note. e.detail is used for `DOMMouseScroll`
            const y = (listContentOffsetRef.current?.y ?? 0) - delta * factor;
            if (ref.current) {
                const scrollResponder = ref.current.getScrollResponder();
                if (scrollResponder) {
                    // scrollResponder.scrollTo({ x: 0, y }); Seems to be async. Move to sync bellow
                    // TODO: what exactly this for, and why it tries to set property on a number???
                    const scrollableNode: any = scrollResponder.getScrollableNode();
                    if (scrollableNode) {
                        scrollableNode.scrollTop = y;
                    }
                }
            }
        }
    }, []);

    useWheelHandler(handler);
}

const renderItemInternal = (onLayoutCell: (key: string, e: any) => void) => ({
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

function useLayoutHelpers(canLoadMore: boolean) {
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
                if (!canLoadMore) {
                    return 0;
                }
                return (
                    UIConstant.smallCellHeight() +
                    UIConstant.contentOffset() * 2
                );
            },
        }),
        [canLoadMore, cellsHeight]
    );

    const onLayoutCell = React.useCallback((key: string, e: any) => {
        const { nativeEvent } = e;
        if (nativeEvent) {
            const { layout } = nativeEvent;
            cellsHeight.current.set(key, layout.height);
        }
    }, []);

    const renderItem = React.useCallback(renderItemInternal(onLayoutCell), []);

    return {
        getItemLayout,
        renderItem,
    };
}

const keyExtractor = (item: ChatMessage) => {
    return item.key;
};

const renderBubble = (message: ChatMessage) => {
    switch (message.type) {
        case ChatMessageType.PlainText:
            return <BubblePlainText {...message} key={message.key} />;
        case ChatMessageType.System:
            return <BubbleSystem {...message} key={message.key} />;
        case ChatMessageType.Transaction:
            return <BubbleTransaction {...message} key={message.key} />;
        case ChatMessageType.Image:
            return <BubbleImage {...message} key={message.key} />;
        case ChatMessageType.Document:
            return <BubbleDocument {...message} key={message.key} />;
        case ChatMessageType.Sticker:
            return <BubbleSticker {...message} key={message.key} />;
        case ChatMessageType.ActionButton:
            return <BubbleActionButton {...message} key={message.key} />;
        default:
            return null;
    }
};

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

type Props = {
    areStickersVisible: boolean;
    onLoadEarlierMessages(): void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
    messages: ChatMessage[];
    bottomInset?: number;
};

export const UIChatList = React.forwardRef<SectionList, Props>(
    function UIChatListForwarded(props, ref) {
        const keyboardDismissProp = React.useMemo(() => {
            if (Platform.OS !== 'ios') {
                // The following is not working on Android >>>
                // See https://github.com/facebook/react-native/issues/23364
                return 'on-drag';

                // This can be used as a workaround >>>>
                // onScrollBeginDrag: () => {
                //     Keyboard.dismiss();
                //     UICustomKeyboardUtils.dismiss();
                // },
            }
            if (props.areStickersVisible) {
                return 'none'; // `interactive` doesn't work well with UICustomKeyboard :(
            }
            return 'interactive';
        }, [props.areStickersVisible]);

        const localRef = React.useRef<SectionList>(null);

        // @ts-ignore localRef.current can be null by types, hence it contradict with
        // useImperativeHandle type, but this is actually works
        React.useImperativeHandle(ref, () => {
            return localRef.current;
        });

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
            const hasOverflow =
                contentHeight.current > listSize.current?.height;

            const shouldLinesBeShown = hasScroll || (hasHeight && hasOverflow);

            if (shouldLinesBeShown === linesIsShown.current) {
                return;
            }

            linesAnimationInProgress.current = true;
            const animation = shouldLinesBeShown
                ? showLinesAnimation
                : hideLinesAnimation;
            animation.current?.start(() => {
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

        const { getItemLayout, renderItem } = useLayoutHelpers(
            props.canLoadMore
        );
        useChatListWheelHandler(localRef, listContentOffset);
        const insets = useSafeAreaInsets();
        const bottomInset = props.bottomInset ?? 0;
        const contentInset = {
            top: bottomInset - insets.top,
            bottom: -(insets.bottom ?? 0),
        };

        React.useEffect(() => {
            if (listContentOffset.current.y < bottomInset) {
                const scrollResponder = localRef.current?.getScrollResponder();
                if (scrollResponder) {
                    scrollResponder.scrollTo({
                        y: -bottomInset,
                        animated: true,
                    });
                }
            }
        }, [bottomInset]);

        const sections = React.useMemo(
            () => UIChatListFormatter.getSections(props.messages),
            [props.messages]
        );

        return (
            <View style={styles.container}>
                <TapGestureHandler
                    onHandlerStateChange={onHandlerStateChange}
                    enabled={props.areStickersVisible}
                >
                    <SectionList
                        nativeID={CHAT_SECTION_LIST}
                        testID="chat_container"
                        keyboardDismissMode={keyboardDismissProp}
                        contentInset={contentInset}
                        scrollIndicatorInsets={contentInset}
                        ref={localRef}
                        inverted
                        getItemLayout={getItemLayout}
                        onLayout={onLayout}
                        onContentSizeChange={onContentSizeChange}
                        onScroll={onScrollMessages}
                        onScrollToIndexFailed={(info) =>
                            console.error('Failed to scroll to index:', info)
                        }
                        scrollEventThrottle={UIConstant.maxScrollEventThrottle()}
                        style={style}
                        contentContainerStyle={styles.messagesList}
                        sections={sections}
                        onViewableItemsChanged={checkVisualStyle}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
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
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
    },
    messagesList: {
        paddingHorizontal: UIConstant.contentOffset(),
        paddingVertical: UIConstant.contentOffset(),
    },
});
