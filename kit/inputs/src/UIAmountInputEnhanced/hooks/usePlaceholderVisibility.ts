/* eslint-disable react-hooks/rules-of-hooks */

import {
    SharedValue,
    useAnimatedReaction,
    useSharedValue,
    useWorkletCallback,
} from 'react-native-reanimated';

export function usePlaceholderVisibility(
    isExpanded: SharedValue<boolean>,
    hasLabel: boolean,
): {
    isPlaceholderVisible: SharedValue<boolean>;
    /** @worklet */
    showPlacehoder: () => void;
} {
    /** The `hasLabel` can't change because it derived from immutable ref */
    if (!hasLabel) {
        return {
            isPlaceholderVisible: useSharedValue(true),
            showPlacehoder: () => null,
        };
    }

    const isPlaceholderVisible = useSharedValue(isExpanded.value);

    /**
     * We need to show the placeholder after the expanding animation ends
     */
    const showPlacehoder = useWorkletCallback(() => {
        isPlaceholderVisible.value = true;
    });

    const hidePlacehoder = useWorkletCallback(() => {
        isPlaceholderVisible.value = false;
    });

    useAnimatedReaction(
        () => isExpanded.value,
        (expanded, prevExpanded) => {
            if (expanded === prevExpanded) {
                return;
            }
            if (!expanded) {
                hidePlacehoder();
            }
        },
    );

    return {
        isPlaceholderVisible,
        showPlacehoder,
    };
}
