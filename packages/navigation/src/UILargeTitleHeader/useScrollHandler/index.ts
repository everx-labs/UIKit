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
    shiftChangedForcibly: Animated.SharedValue<boolean>,
    largeTitleHeight: Animated.SharedValue<number>,
    hasScrollShared: Animated.SharedValue<boolean>,
    rubberBandDistance: number,
) {
    // TODO: maybe move it to ctx?
    // when we use `rubber band` effect, we need to know
    // actual y, that's why we need to store it separately
    const yWithoutRubberBand = useSharedValue(0);
    // see `useAnimatedGestureHandler`
    const yIsNegative = useSharedValue(true);

    const { parentHandler: parentScrollHandler, parentHandlerActive: parentScrollHandlerActive } =
        useScrollableParentScrollHandler();

    const onBeginDrag = useOnBeginDrag(
        shift,
        shiftChangedForcibly,
        yWithoutRubberBand,
        parentScrollHandler,
    );

    const onScroll = useOnScrollHandler(
        scrollRef,
        largeTitleViewRef,
        largeTitleHeight,
        yIsNegative,
        yWithoutRubberBand,
        shift,
        shiftChangedForcibly,
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
        shiftChangedForcibly,
        largeTitleHeight,
        defaultShift,
        yWithoutRubberBand,
        mightApplyShiftToScrollView,
        parentScrollHandler,
        parentScrollHandlerActive,
    );

    const onMomentumEnd = useOnMomentumEnd(shift, defaultShift, largeTitleHeight);

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
        scrollHandler,
        gestureHandler,
        onWheel,
    };
}
