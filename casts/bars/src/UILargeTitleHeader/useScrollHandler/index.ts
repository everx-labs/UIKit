import Animated, {
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useSharedValue,
    scrollTo,
} from 'react-native-reanimated';
import { useScrollableParentScrollHandler } from '@tonlabs/uikit.scrolls';
import type { ScrollHandlerContext } from './scrollContext';
import { useOnScrollHandler } from './useOnScrollHandler';
import { useOnWheelHandler } from './useOnWheelHandler';
import { useOnEndDrag } from './useOnEndDrag';
import { useOnMomentumEnd } from './useOnMomentumEnd';
import { useOnBeginDrag } from './useOnBeginDrag';

export function useScrollHandler(
    scrollRef: React.RefObject<Animated.ScrollView>,
    largeTitleViewRef: React.RefObject<Animated.View>,
    currentPosition: Animated.SharedValue<number>,
    defaultPosition: Animated.SharedValue<number>,
    largeTitleHeight: Animated.SharedValue<number>,
    hasScrollShared: Animated.SharedValue<boolean>,
) {
    // see `useAnimatedGestureHandler` and `onWheel`
    const yIsNegative = useSharedValue(true);

    const { parentHandler: parentScrollHandler, parentHandlerActive: parentScrollHandlerActive } =
        useScrollableParentScrollHandler();

    const mightApplyShiftToScrollView = useSharedValue(false);

    const onBeginDrag = useOnBeginDrag(
        currentPosition,
        mightApplyShiftToScrollView,
        parentScrollHandler,
    );

    const onScroll = useOnScrollHandler(
        scrollRef,
        largeTitleViewRef,
        largeTitleHeight,
        currentPosition,
        parentScrollHandler,
        parentScrollHandlerActive,
    );

    useAnimatedReaction(
        () => {
            return {
                currentPosition: currentPosition.value,
                largeTitleHeight: largeTitleHeight.value,
                mightApplyShiftToScrollView: mightApplyShiftToScrollView.value,
            };
        },
        state => {
            // console.log(state.currentPosition, state.largeTitleHeight);
            if (!state.mightApplyShiftToScrollView) {
                return;
            }

            if (state.currentPosition < 0 - state.largeTitleHeight) {
                // console.log(
                //     state.currentPosition,
                //     // eslint-disable-next-line no-bitwise
                //     ~(state.currentPosition + state.largeTitleHeight) + 1,
                // );
                scrollTo(
                    scrollRef,
                    0,
                    // eslint-disable-next-line no-bitwise
                    -1 * (state.currentPosition + state.largeTitleHeight),
                    false,
                );
            }
        },
    );

    const onEndDrag = useOnEndDrag(
        currentPosition,
        largeTitleHeight,
        defaultPosition,
        mightApplyShiftToScrollView,
        parentScrollHandler,
        parentScrollHandlerActive,
    );

    const onMomentumEnd = useOnMomentumEnd(currentPosition, defaultPosition, largeTitleHeight);

    const scrollHandler = useAnimatedScrollHandler<ScrollHandlerContext>({
        onBeginDrag,
        onScroll,
        onEndDrag,
        onMomentumEnd,
    });

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
        onWheel,
    };
}
