/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
import * as React from 'react';
import type {
    DefaultSectionT,
    FlatListProps,
    ScrollResponderMixin,
    ScrollViewProps,
    SectionListProps,
    SectionListScrollParams,
    View,
    ScrollView as RNOriginalScrollView,
    NodeHandle,
} from 'react-native';
import type { ScrollableAdditionalProps } from './wrapScrollableComponent';

type Constructor<T> = new (...args: any[]) => T;

declare class ScrollViewComponent extends React.Component<
    ScrollViewProps & ScrollableAdditionalProps
> {}
declare const ScrollViewBase: Constructor<ScrollResponderMixin> & typeof ScrollViewComponent;

// Copied from react-native types
export declare class RNScrollView extends ScrollViewBase {
    /**
     * Scrolls to a given x, y offset, either immediately or with a smooth animation.
     * Syntax:
     *
     * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
     *
     * Note: The weird argument signature is due to the fact that, for historical reasons,
     * the function also accepts separate arguments as an alternative to the options object.
     * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
     */
    scrollTo(
        y?:
            | number
            | { x?: number | undefined; y?: number | undefined; animated?: boolean | undefined },
        x?: number,
        animated?: boolean,
    ): void;

    /**
     * A helper function that scrolls to the end of the scrollview;
     * If this is a vertical ScrollView, it scrolls to the bottom.
     * If this is a horizontal ScrollView scrolls to the right.
     *
     * The options object has an animated prop, that enables the scrolling animation or not.
     * The animated prop defaults to true
     */
    scrollToEnd(options?: { animated: boolean }): void;

    /**
     * Displays the scroll indicators momentarily.
     */
    flashScrollIndicators(): void;

    /**
     * Returns a reference to the underlying scroll responder, which supports
     * operations like `scrollTo`. All ScrollView-like components should
     * implement this method so that they can be composed while providing access
     * to the underlying scroll responder's methods.
     */
    getScrollResponder(): ScrollResponderMixin;

    getScrollableNode(): any;

    // Undocumented
    getInnerViewNode(): any;

    /**
     * @deprecated Use scrollTo instead
     */
    scrollWithoutAnimationTo?: ((y: number, x: number) => void) | undefined;

    /**
     * This function sends props straight to native. They will not participate in
     * future diff process - this means that if you do not include them in the
     * next render, they will remain active (see [Direct
     * Manipulation](https://reactnative.dev/docs/direct-manipulation)).
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    setNativeProps(nativeProps: object): void;
}

// Copied from RN types
export declare class RNFlatList<ItemT = any> extends React.Component<
    FlatListProps<ItemT> & ScrollableAdditionalProps
> {
    /**
     * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
     */
    scrollToEnd: (params?: { animated?: boolean | null | undefined }) => void;

    /**
     * Scrolls to the item at the specified index such that it is positioned in the viewable area
     * such that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
     * Cannot scroll to locations outside the render window without specifying the getItemLayout prop.
     */
    scrollToIndex: (params: {
        animated?: boolean | null | undefined;
        index: number;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }) => void;

    /**
     * Requires linear scan through data - use `scrollToIndex` instead if possible.
     * May be janky without `getItemLayout` prop.
     */
    scrollToItem: (params: {
        animated?: boolean | null | undefined;
        item: ItemT;
        viewPosition?: number | undefined;
    }) => void;

    /**
     * Scroll to a specific content pixel offset, like a normal `ScrollView`.
     */
    scrollToOffset: (params: { animated?: boolean | null | undefined; offset: number }) => void;

    /**
     * Tells the list an interaction has occurred, which should trigger viewability calculations,
     * e.g. if waitForInteractions is true and the user has not scrolled. This is typically called
     * by taps on items or by navigation actions.
     */
    recordInteraction: () => void;

    /**
     * Displays the scroll indicators momentarily.
     */
    flashScrollIndicators: () => void;

    /**
     * Provides a handle to the underlying scroll responder.
     */
    getScrollResponder: () => JSX.Element | null | undefined;

    /**
     * Provides a reference to the underlying host component
     */
    getNativeScrollRef: () =>
        | React.RefObject<View>
        | React.RefObject<ScrollViewComponent>
        | null
        | undefined;

    getScrollableNode: () => any;

    // TODO: use `unknown` instead of `any` for Typescript >= 3.0
    setNativeProps: (props: { [key: string]: any }) => void;
}

// Copied from RN types
export declare class RNSectionList<ItemT = any, SectionT = DefaultSectionT> extends React.Component<
    SectionListProps<ItemT, SectionT> & ScrollableAdditionalProps
> {
    /**
     * Scrolls to the item at the specified sectionIndex and itemIndex (within the section)
     * positioned in the viewable area such that viewPosition 0 places it at the top
     * (and may be covered by a sticky header), 1 at the bottom, and 0.5 centered in the middle.
     */
    // eslint-disable-next-line react/sort-comp
    scrollToLocation(params: SectionListScrollParams): void;

    /**
     * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
     * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
     * taps on items or by navigation actions.
     */
    recordInteraction(): void;

    /**
     * Displays the scroll indicators momentarily.
     *
     * @platform ios
     */
    flashScrollIndicators(): void;

    /**
     * Provides a handle to the underlying scroll responder.
     */
    getScrollResponder(): RNOriginalScrollView | undefined;

    /**
     * Provides a handle to the underlying scroll node.
     */
    getScrollableNode(): NodeHandle | undefined;
}
