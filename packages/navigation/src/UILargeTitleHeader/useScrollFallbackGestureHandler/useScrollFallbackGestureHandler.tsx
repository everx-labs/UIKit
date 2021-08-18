/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { useAnimatedGestureHandler } from 'react-native-reanimated';

/**
 * On Android ScrollView stops to fire events when it reaches the end (y is 0).
 * For that reason we place a ScrollView inside of PanResponder,
 * and listen for that events too.
 *
 * In a regular case we just handle events from scroll.
 * But when we see that `y` point is 0 or less, we set a `yIsNegative` guard to true.
 * That tells GH handler to start handle events from a pan gesture.
 * And that is how we are able to animate large header on overscroll.
 *
 * Is doesn't return anything for iOS and web to not create unnecessary objects in memory
 */
export function useScrollFallbackGestureHandler(
    _shift: Animated.SharedValue<number>,
    _shiftChangedForcibly: Animated.SharedValue<boolean>,
    _hasScrollShared: Animated.SharedValue<boolean>,
    _yIsNegative: Animated.SharedValue<boolean>,
    _yWithoutRubberBand: Animated.SharedValue<number>,
    _onScroll: (event: NativeScrollEvent) => void,
    _onEndDrag: () => void,
): ReturnType<typeof useAnimatedGestureHandler> | undefined {
    return undefined;
}
