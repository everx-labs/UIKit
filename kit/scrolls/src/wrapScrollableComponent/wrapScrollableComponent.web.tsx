import * as React from 'react';
import { ScrollViewProps, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';
import type { ScrollableAdditionalProps } from './types';

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
            contentInset,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            scrollIndicatorInsets,
            contentContainerStyle: contentContainerStyleProp,
            ...props
        }: Props & ScrollableAdditionalProps & { children?: React.ReactNode },
        forwardRef: React.RefObject<typeof AnimatedScrollable>,
    ) {
        const {
            horizontal,
            // @ts-ignore
            onWheel: onWheelProp,
            onLayout: onLayoutProp,
            onContentSizeChange: onContentSizeChangeProp,
        } = props;
        const { onLayout, onContentSizeChange } = useHasScroll(
            onLayoutProp,
            onContentSizeChangeProp,
        );

        const { ref, scrollHandler, onWheel, registerScrollable, unregisterScrollable } =
            React.useContext(ScrollableContext);

        React.useEffect(() => {
            if (registerScrollable) {
                registerScrollable();
            }

            return () => {
                if (unregisterScrollable) {
                    unregisterScrollable();
                }
            };
        }, [registerScrollable, unregisterScrollable]);

        // @ts-ignore
        React.useImperativeHandle(forwardRef, () => {
            return ref?.current;
        });

        const automaticInsets =
            automaticallyAdjustContentInsets || automaticallyAdjustKeyboardInsets;

        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(contentContainerStyleProp) || {};

            if (!automaticInsets) {
                return style;
            }

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    contentInset?.left,
                ),
                paddingTop: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    contentInset?.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    contentInset?.right,
                ),
                paddingBottom: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    contentInset?.bottom,
                ),
            };
        }, [contentInset, contentContainerStyleProp, automaticInsets]);

        return (
            <Animated.View style={containerStyle}>
                {/* @ts-ignore */}
                <AnimatedScrollable
                    {...props}
                    ref={ref}
                    overScrollMode="never"
                    onScrollBeginDrag={horizontal ? undefined : scrollHandler}
                    scrollEventThrottle={16}
                    // @ts-ignore
                    onWheel={horizontal ? onWheelProp : onWheel}
                    onLayout={onLayout}
                    onContentSizeChange={onContentSizeChange}
                    contentContainerStyle={contentContainerStyle}
                />
            </Animated.View>
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
