import * as React from 'react';
import Animated, {
    runOnJS,
    useSharedValue,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

const withSpringConfig: WithSpringConfig = {
    stiffness: 150,
    overshootClamping: true,
};

function getPosition(isExpanded: boolean): number {
    return isExpanded ? POSITION_EXPANDED : POSITION_FOLDED;
}

/**
 * Returns animated label expanding position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
export function useExpandingValue(
    isExpanded: boolean,
    showPlacehoder: () => void,
): Readonly<Animated.SharedValue<number>> {
    /** Label position switcher (POSITION_FOLDED/POSITION_EXPANDED) */
    const expandingPosition: Animated.SharedValue<number> = useSharedValue<number>(
        getPosition(isExpanded),
    );

    const onExpand = React.useCallback(
        (isFinished?: boolean): void => {
            'worklet';

            if (isFinished) {
                runOnJS(showPlacehoder)();
            }
        },
        [showPlacehoder],
    );

    React.useEffect(() => {
        const toValue = getPosition(isExpanded);
        /**
         * We don't need to run animation if expandingPosition is already in correct state.
         * It leads to unwanted calling of `onExpand` callback.
         */
        if (toValue === expandingPosition.value) {
            return;
        }
        const callback = isExpanded ? onExpand : undefined;
        expandingPosition.value = withSpring(toValue, withSpringConfig, callback);
    }, [isExpanded, expandingPosition, onExpand]);

    return expandingPosition;
}
