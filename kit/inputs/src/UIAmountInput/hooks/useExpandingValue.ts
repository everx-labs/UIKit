/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
import type BigNumber from 'bignumber.js';
import {
    SharedValue,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    useWorkletCallback,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';
import type { ExpansionState } from '../types';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

const withSpringConfig: WithSpringConfig = {
    stiffness: 150,
    overshootClamping: true,
};

function getPosition(expansionState: ExpansionState): number {
    'worklet';

    return expansionState === 'Expanded' || expansionState === 'InExpandProgress'
        ? POSITION_EXPANDED
        : POSITION_FOLDED;
}

/**
 * Returns animated label expanding position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
export function useExpandingValue(
    isFocused: SharedValue<boolean>,
    formattedText: SharedValue<string>,
    defaultAmount: BigNumber | undefined,
    hasLabel: boolean,
) {
    /** The `hasLabel` can't change because it derived from immutable ref */
    if (!hasLabel) {
        return {
            expandingValue: useSharedValue(0),
            expansionState: useSharedValue<ExpansionState>('Expanded'),
        };
    }

    const expansionState = useSharedValue<ExpansionState>(
        isFocused.value || !!defaultAmount ? 'Expanded' : 'Collapsed',
    );

    useAnimatedReaction(
        () => ({
            isFocused: isFocused.value,
            hasText: !!formattedText.value,
        }),
        (currentState, prevState) => {
            if (!prevState) {
                return;
            }
            if (
                prevState.hasText !== currentState?.hasText ||
                prevState.isFocused !== currentState.isFocused
            ) {
                expansionState.value =
                    currentState.isFocused || currentState.hasText
                        ? 'InExpandProgress'
                        : 'InCollapseProgress';
            }
        },
    );
    const onEndAnimation = useWorkletCallback((isFinished?: boolean): void => {
        if (isFinished) {
            if (expansionState.value === 'InExpandProgress') {
                expansionState.value = 'Expanded';
            }
            if (expansionState.value === 'InCollapseProgress') {
                expansionState.value = 'Collapsed';
            }
        }
    });

    const expandingValue = useDerivedValue(() => {
        const toPosition = getPosition(expansionState.value);
        return withSpring(toPosition, withSpringConfig, onEndAnimation);
    });

    return {
        expandingValue,
        expansionState,
    };
}
