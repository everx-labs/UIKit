import * as React from 'react';
import Animated, {
    runOnJS,
    useDerivedValue,
    useSharedValue,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

const withSpringConfig: WithSpringConfig = {
    damping: 17,
    stiffness: 150,
};

const getPosition = (isExpanded: boolean): number => {
    return isExpanded ? POSITION_EXPANDED : POSITION_FOLDED;
};

/**
 * Returns animated label expanding position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
export const useExpandingValue = (
    isExpanded: boolean,
    onExpand: () => void,
): Readonly<Animated.SharedValue<number>> => {
    /** Label position switcher (POSITION_FOLDED/POSITION_EXPANDED) */
    const expandingPosition: Animated.SharedValue<number> = useSharedValue<number>(
        getPosition(isExpanded),
    );

    React.useEffect(() => {
        expandingPosition.value = getPosition(isExpanded);
    }, [isExpanded, expandingPosition]);

    const animationCallback = React.useCallback(
        (isFinished?: boolean): void => {
            'worklet';

            if (isFinished && expandingPosition.value === POSITION_EXPANDED) {
                runOnJS(onExpand)();
            }
        },
        [expandingPosition.value, onExpand],
    );

    const expandingValue: Readonly<Animated.SharedValue<number>> = useDerivedValue(() => {
        return withSpring(expandingPosition.value, withSpringConfig, animationCallback);
    });
    return expandingValue;
};
