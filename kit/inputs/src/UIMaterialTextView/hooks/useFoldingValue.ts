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

const getPosition = (isFolded: boolean): number => {
    return isFolded ? POSITION_FOLDED : POSITION_EXPANDED;
};

/**
 * Returns animated label folding position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
export const useFoldingValue = (
    isFolded: boolean,
    onFolding: () => void,
): Readonly<Animated.SharedValue<number>> => {
    /** Label position switcher (POSITION_FOLDED/POSITION_EXPANDED) */
    const foldingPosition: Animated.SharedValue<number> = useSharedValue<number>(
        getPosition(isFolded),
    );

    React.useEffect(() => {
        foldingPosition.value = getPosition(isFolded);
    }, [isFolded, foldingPosition]);

    const animationCallback = React.useCallback(
        (isFinished?: boolean): void => {
            'worklet';

            if (isFinished && foldingPosition.value === POSITION_FOLDED) {
                runOnJS(onFolding)();
            }
        },
        [foldingPosition.value, onFolding],
    );

    const foldingValue: Readonly<Animated.SharedValue<number>> = useDerivedValue(() => {
        return withSpring(foldingPosition.value, withSpringConfig, animationCallback);
    });
    return foldingValue;
};
