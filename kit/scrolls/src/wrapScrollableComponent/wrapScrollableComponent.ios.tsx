import * as React from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { ScrollableContext } from '../Context';
import { useHasScroll } from './useHasScroll';
import { ScrollableAutomaticInsets } from './ScrollableAutomaticInsets';

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
            ...props
        }: Props & {
            children?: React.ReactNode;
            containerStyle: StyleProp<ViewStyle>;
            automaticallyAdjustKeyboardInsets: boolean;
        },
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

        const { ref, scrollHandler, registerScrollable, unregisterScrollable } =
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
        });

        // @ts-ignore
        React.useImperativeHandle(forwardRef, () => {
            return ref?.current;
        });

        const automaticInsets =
            automaticallyAdjustContentInsets || automaticallyAdjustKeyboardInsets;

        return (
            <Animated.View style={containerStyle}>
                {/* @ts-ignore */}
                <AnimatedScrollable
                    {...props}
                    ref={ref}
                    onScrollBeginDrag={horizontal ? undefined : scrollHandler}
                    scrollEventThrottle={16}
                    onLayout={horizontal ? undefined : onLayout}
                    onContentSizeChange={horizontal ? undefined : onContentSizeChange}
                    contentInset={automaticInsets ? undefined : contentInset}
                />
                {automaticInsets ? (
                    <ScrollableAutomaticInsets
                        automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                        contentInset={contentInset}
                    />
                ) : null}
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
