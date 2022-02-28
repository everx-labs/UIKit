import * as React from 'react';
import { Insets, ScrollViewProps, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';
import type { ScrollableAdditionalProps } from './types';
import { ScrollableAutomaticInsets } from './ScrollableAutomaticInsets';

const emptyInsets: Insets = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
};

function getContentContainerPadding(padding: ViewStyle['padding'], inset: number | undefined) {
    if (padding == null) {
        return inset ?? 0;
    }

    if (typeof padding === 'string') {
        return padding;
    }

    return padding + (inset ?? 0);
}

export function wrapScrollableComponent<Props extends ScrollViewProps>(
    ScrollableComponent: React.ComponentClass<Props>,
    displayName: string,
) {
    const AnimatedScrollable = Animated.createAnimatedComponent(ScrollableComponent);

    function ScrollableForwarded(
        {
            containerStyle = { flex: 1 },
            automaticallyAdjustContentInsets,
            automaticallyAdjustKeyboardInsets,
            keyboardInsetAdjustmentBehavior,
            contentInset,
            scrollIndicatorInsets,
            ...props
        }: Props & ScrollableAdditionalProps & { children?: React.ReactNode },
        forwardRef: React.RefObject<typeof AnimatedScrollable>,
    ) {
        const {
            horizontal,
            onLayout: onLayoutProp,
            onContentSizeChange: onContentSizeChangeProp,
        } = props;
        const { onLayout, onContentSizeChange } = useHasScroll(
            onLayoutProp,
            onContentSizeChangeProp,
        );
        const nativeGestureRef = React.useRef<NativeViewGestureHandler>(null);

        const {
            ref,
            panGestureHandlerRef,
            scrollHandler,
            gestureHandler,
            registerScrollable,
            unregisterScrollable,
        } = React.useContext(ScrollableContext);

        React.useEffect(() => {
            if (registerScrollable) {
                registerScrollable();
            }

            return () => {
                if (unregisterScrollable) {
                    unregisterScrollable();
                }
            };
        });

        // @ts-ignore
        React.useImperativeHandle(forwardRef, () => {
            return ref?.current;
        });

        const automaticInsets =
            automaticallyAdjustContentInsets || automaticallyAdjustKeyboardInsets;

        const [internalContentInset, setInternalContentInset] = React.useState<Insets>(
            contentInset || emptyInsets,
        );

        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(props.contentContainerStyle) || {};

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    internalContentInset.left,
                ),
                paddingTop: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    internalContentInset.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    internalContentInset.right,
                ),
                paddingBottom: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    internalContentInset.bottom,
                ),
            };
        }, [internalContentInset, props.contentContainerStyle]);

        return (
            <PanGestureHandler
                ref={panGestureHandlerRef}
                shouldCancelWhenOutside={false}
                onGestureEvent={horizontal ? undefined : gestureHandler}
                simultaneousHandlers={nativeGestureRef}
            >
                <Animated.View style={containerStyle}>
                    <NativeViewGestureHandler
                        ref={nativeGestureRef}
                        disallowInterruption
                        shouldCancelWhenOutside={false}
                    >
                        {/* @ts-ignore */}
                        <AnimatedScrollable
                            {...props}
                            ref={ref}
                            overScrollMode="never"
                            onScrollBeginDrag={horizontal ? undefined : scrollHandler}
                            scrollEventThrottle={16}
                            onLayout={horizontal ? undefined : onLayout}
                            onContentSizeChange={horizontal ? undefined : onContentSizeChange}
                            contentInset={automaticInsets ? undefined : contentInset}
                            scrollIndicatorInsets={
                                automaticInsets ? undefined : scrollIndicatorInsets
                            }
                            contentContainerStyle={contentContainerStyle}
                        />
                    </NativeViewGestureHandler>
                    {automaticInsets ? (
                        <ScrollableAutomaticInsets
                            automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                            automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                            keyboardInsetAdjustmentBehavior={keyboardInsetAdjustmentBehavior}
                            contentInset={contentInset}
                            onInsetsChange={setInternalContentInset}
                        />
                    ) : null}
                </Animated.View>
            </PanGestureHandler>
        );
    }

    ScrollableForwarded.displayName = `${displayName}Inner`;

    const Scrollable = React.forwardRef<typeof ScrollableComponent>(
        // @ts-ignore
        ScrollableForwarded,
    );

    Scrollable.displayName = displayName;

    return Scrollable;
}
