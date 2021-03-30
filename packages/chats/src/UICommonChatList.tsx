import * as React from 'react';
import {
    Platform,
    SectionList,
    StyleSheet,
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    LayoutChangeEvent,
    SectionListProps,
    ScrollViewProps,
    VirtualizedListProps,
    ViewStyle,
    StyleProp,
    ListRenderItem,
    ViewProps,
} from 'react-native';
import {
    TapGestureHandler,
    ScrollView,
    State as RNGHState,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';

import type { BubbleBaseT, ChatMessage } from './types';

import { callChatOnScrollListener } from './useChatOnScrollListener';
import { callChatOnTapListener } from './useChatOnTapListener';

type RNGHEvent<T> = { nativeEvent: T };

const onHandlerStateChange = ({
    nativeEvent: { state },
}: RNGHEvent<{ state: RNGHState }>) => {
    if (state === RNGHState.ACTIVE) {
        callChatOnTapListener();
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

type WheelEvent = Event & {
    deltaY?: number;
    detail?: number;
};

type ListContentOffset = { y: number };

function useWheelHandler(handler: (e: WheelEvent) => void) {
    React.useEffect(() => {
        if (Platform.OS !== 'web') {
            return undefined;
        }

        window.addEventListener(wheelEvent, handler, { passive: false });

        return () => {
            window.removeEventListener(wheelEvent, handler);
        };
    }, [handler]);
}

function useChatListWheelHandler(
    ref: React.Ref<SectionList>,
    nativeID: string,
    listContentOffsetRef: React.RefObject<ListContentOffset>,
) {
    const handler = React.useCallback(
        (e: WheelEvent) => {
            const scroll = document.getElementById(nativeID);
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
                const y =
                    (listContentOffsetRef.current?.y ?? 0) - delta * factor;
                if (ref.current) {
                    const scrollResponder = ref.current.getScrollResponder();
                    if (scrollResponder) {
                        // scrollResponder.scrollTo({ x: 0, y }); Seems to be async. Move to sync bellow
                        const scrollableNode = scrollResponder.getScrollableNode();
                        if (scrollableNode) {
                            scrollableNode.scrollTop = y;
                        }
                    }
                }
            }
        },
        [listContentOffsetRef, ref, nativeID],
    );

    useWheelHandler(handler);
}

type RenderBubble<ItemT> = (
    props: ItemT,
    onLayoutCell: ViewProps['onLayout'],
) => React.ReactElement | null;

type GetItemLayoutFabric = <ItemT>(
    ...args: any
) => Required<VirtualizedListProps<ItemT>>['getItemLayout'];

function useLayoutHelpers<ItemT extends BubbleBaseT>(
    canLoadMore: boolean,
    renderBubble: RenderBubble<ItemT>,
    getItemLayoutFabric: GetItemLayoutFabric,
) {
    const cellsHeight = React.useRef(new Map());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getItemLayout = React.useCallback(
        getItemLayoutFabric({
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
        [canLoadMore, cellsHeight, getItemLayoutFabric],
    );

    const onLayoutCell = React.useCallback((key: string, e: any) => {
        const { nativeEvent } = e;
        if (nativeEvent) {
            const { layout } = nativeEvent;
            cellsHeight.current.set(key, layout.height);
        }
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const renderItem = React.useCallback(
        ({ item }: { item: ItemT }) =>
            renderBubble(item, (e) => onLayoutCell(item.key, e)),
        [onLayoutCell, renderBubble],
    );

    return {
        getItemLayout,
        renderItem,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useContentInset(ref: React.RefObject<SectionList>) {
    const bottomInset = useSafeAreaInsets().bottom;
    const contentInset = React.useMemo(
        () => ({
            top: bottomInset,
        }),
        [bottomInset],
    );

    React.useLayoutEffect(() => {
        function scrollToTop() {
            const scrollResponder = ref?.current?.getScrollResponder();
            if (scrollResponder) {
                scrollResponder.scrollTo({
                    y: -bottomInset,
                    animated: true,
                });
                return;
            }
            requestAnimationFrame(scrollToTop);
        }
        scrollToTop();
    }, [bottomInset, ref]);

    return contentInset;
}

function useLinesAnimation() {
    const listSize = React.useRef({ height: 0 });
    const contentHeight = React.useRef(0);
    const listContentOffset = React.useRef({ y: 0 });

    const topOpacity = React.useRef(new Animated.Value(0));

    const theme = useTheme();

    const lineStyle = React.useMemo(
        () => [
            styles.border,
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.LineSecondary],
            ),
            {
                opacity: topOpacity.current,
            },
        ],
        [theme, topOpacity],
    );

    const linesAnimationInProgress = React.useRef(false);
    const linesIsShown = React.useRef(false);

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

        const animation = Animated.spring(topOpacity.current, {
            toValue: shouldLinesBeShown ? 1 : 0,
            useNativeDriver: true,
            speed: 20,
        });

        animation.start(() => {
            linesAnimationInProgress.current = false;
            linesIsShown.current = shouldLinesBeShown;

            checkVisualStyle();
        });
    }, []);

    const onLayout = React.useCallback(
        (e: LayoutChangeEvent) => {
            listSize.current = e.nativeEvent.layout;

            checkVisualStyle();
        },
        [checkVisualStyle],
    );

    const onContentSizeChange = React.useCallback(
        (_width: number, height: number) => {
            // Save the content height in state
            contentHeight.current = height;

            checkVisualStyle();
        },
        [checkVisualStyle],
    );

    const onScrollMessages = React.useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            listContentOffset.current = e.nativeEvent.contentOffset;

            checkVisualStyle();

            callChatOnScrollListener(e.nativeEvent.contentOffset.y);
        },
        [checkVisualStyle],
    );

    return {
        listContentOffset,
        lineStyle,
        onLayout,
        onContentSizeChange,
        onScrollMessages,
        onViewableItemsChanged: checkVisualStyle,
    };
}

const keyExtractor = <ItemT extends BubbleBaseT>(item: ItemT) => {
    return item.key;
};

const onScrollToIndexFailed: SectionListProps<any>['onScrollToIndexFailed'] = (
    info,
) => console.error('Failed to scroll to index:', info);

const renderScrollComponent: SectionListProps<any>['renderScrollComponent'] = (
    scrollProps,
) => <ScrollView {...scrollProps} />;

export type CommonChatListProps<ItemT extends BubbleBaseT> = {
    ref: React.RefObject<any>;
    nativeID: string;
    keyboardDismissMode: ScrollViewProps['keyboardDismissMode'];
    automaticallyAdjustContentInsets: boolean;
    contentInset: ScrollViewProps['contentInset'];
    inverted: boolean;
    getItemLayout: VirtualizedListProps<ItemT>['getItemLayout'];
    onLayout: VirtualizedListProps<ItemT>['onLayout'];
    onContentSizeChange: VirtualizedListProps<ItemT>['onContentSizeChange'];
    onScroll: VirtualizedListProps<ItemT>['onScroll'];
    onScrollToIndexFailed: VirtualizedListProps<ItemT>['onScrollToIndexFailed'];
    scrollEventThrottle: number;
    style: StyleProp<ViewStyle>;
    contentContainerStyle: StyleProp<ViewStyle>;
    onViewableItemsChanged: VirtualizedListProps<
        ItemT
    >['onViewableItemsChanged'];
    keyExtractor: VirtualizedListProps<ItemT>['keyExtractor'];
    renderItem: ListRenderItem<ItemT>;
    renderScrollComponent: VirtualizedListProps<ItemT>['renderScrollComponent'];
    onEndReachedThreshold: number;
};

type UICommonChatListProps<ItemT extends BubbleBaseT> = {
    forwardRef: React.Ref<any>;
    nativeID: string;
    renderBubble: RenderBubble<ItemT>;
    getItemLayoutFabric: GetItemLayoutFabric;
    children: (props: CommonChatListProps<ItemT>) => React.ReactNode;
    canLoadMore?: boolean;
    // If you want custom keyboard to be dismissible on touch outside of it
    isCustomKeyboardVisible?: boolean;
};

export function UICommonChatList<ItemT extends BubbleBaseT>({
    forwardRef,
    nativeID,
    renderBubble,
    getItemLayoutFabric,
    canLoadMore = false,
    isCustomKeyboardVisible = false,
    children,
}: UICommonChatListProps<ItemT>) {
    const keyboardDismissProp: ScrollViewProps['keyboardDismissMode'] = React.useMemo(() => {
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

        return 'interactive';
    }, []);

    const localRef = React.useRef<any>(null);

    // @ts-ignore localRef.current can be null by types, hence it contradict with
    // useImperativeHandle type, but this is actually works
    React.useImperativeHandle(forwardRef, () => {
        return localRef.current;
    });

    const { getItemLayout, renderItem } = useLayoutHelpers(
        canLoadMore,
        renderBubble,
        getItemLayoutFabric,
    );
    const {
        listContentOffset,
        lineStyle,
        onLayout,
        onContentSizeChange,
        onScrollMessages,
        onViewableItemsChanged,
    } = useLinesAnimation();
    useChatListWheelHandler(localRef, nativeID, listContentOffset);
    const contentInset = useContentInset(localRef);

    return (
        <>
            <Animated.View style={lineStyle} />
            <TapGestureHandler
                onHandlerStateChange={onHandlerStateChange}
                enabled={isCustomKeyboardVisible}
            >
                {children({
                    ref: localRef,
                    nativeID,
                    keyboardDismissMode: keyboardDismissProp,
                    automaticallyAdjustContentInsets: false,
                    contentInset,
                    inverted: true,
                    getItemLayout,
                    onLayout,
                    onContentSizeChange,
                    onScroll: onScrollMessages,
                    onScrollToIndexFailed,
                    scrollEventThrottle: UIConstant.maxScrollEventThrottle(),
                    style,
                    contentContainerStyle: styles.messagesList,
                    onViewableItemsChanged,
                    keyExtractor,
                    renderItem,
                    onEndReachedThreshold: 0.6,
                    renderScrollComponent,
                })}
            </TapGestureHandler>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
    },
    messagesList: {
        paddingHorizontal: UIConstant.contentOffset(),
        paddingVertical: UIConstant.contentOffset(),
    },
    border: {
        height: 1,
    },
});
