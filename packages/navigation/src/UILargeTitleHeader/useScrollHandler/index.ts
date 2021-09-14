import Animated, {
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useSharedValue,
    scrollTo,
} from 'react-native-reanimated';
import { useScrollableParentScrollHandler } from '../../Scrollable/Context';
import type { ScrollHandlerContext } from '../types';
import { useOnScrollHandler } from './useOnScrollHandler';
import { useOnWheelHandler } from './useOnWheelHandler';
import { useOnEndDrag } from './useOnEndDrag';
import { useScrollFallbackGestureHandler } from './useScrollFallbackGestureHandler';
import { useOnMomentumEnd } from './useOnMomentumEnd';
import { useOnBeginDrag } from './useOnBeginDrag';

export function useScrollHandler(
    scrollRef: React.RefObject<Animated.ScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    shift: Animated.SharedValue<number>,
    defaultShift: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    hasScrollShared: Animated.SharedValue<boolean>,
    rubberBandDistance: number,
) {
    const scrollInProgress = useSharedValue(false);
    // see `useAnimatedGestureHandler` and `onWheel`
    const yIsNegative = useSharedValue(true);

    const { parentHandler: parentScrollHandler, parentHandlerActive: parentScrollHandlerActive } =
        useScrollableParentScrollHandler();

    const onBeginDrag = useOnBeginDrag(shift, scrollInProgress, parentScrollHandler);

    const onScroll = useOnScrollHandler(
        scrollRef,
        largeTitleViewRef,
        largeTitleHeight,
        yIsNegative,
        shift,
        rubberBandDistance,
        parentScrollHandler,
        parentScrollHandlerActive,
    );

    const mightApplyShiftToScrollView = useSharedValue(false);

    useAnimatedReaction(
        () => {
            return {
                shift: shift.value,
                largeTitleHeight: largeTitleHeight.value,
                mightApplyShiftToScrollView: mightApplyShiftToScrollView.value,
            };
        },
        state => {
            if (!state.mightApplyShiftToScrollView) {
                return;
            }

            scrollTo(scrollRef, 0, 0 - state.shift - state.largeTitleHeight, false);
        },
    );

    const onEndDrag = useOnEndDrag(
        shift,
        scrollInProgress,
        largeTitleHeight,
        defaultShift,
        mightApplyShiftToScrollView,
        parentScrollHandler,
        parentScrollHandlerActive,
    );

    const onMomentumEnd = useOnMomentumEnd(shift, scrollInProgress, defaultShift, largeTitleHeight);

    const scrollHandler = useAnimatedScrollHandler<ScrollHandlerContext>({
        onBeginDrag,
        onScroll,
        onEndDrag,
        onMomentumEnd,
    });

    const gestureHandler = useScrollFallbackGestureHandler(
        hasScrollShared,
        yIsNegative,
        scrollHandler as any,
    );

    /**
     * On web listening to `scroll` events is not enough,
     * because when it reaches the end (y is 0)
     * it stops to fire new events.
     *
     * But to understand that user still scrolling at the moment
     * we can listen for `wheel` events.
     *
     * That's kinda the same what we did for Android with RNGH
     */
    const onWheel = useOnWheelHandler(yIsNegative, hasScrollShared, scrollHandler as any);

    return {
        scrollInProgress,
        scrollHandler,
        gestureHandler,
        onWheel,
    };
}
