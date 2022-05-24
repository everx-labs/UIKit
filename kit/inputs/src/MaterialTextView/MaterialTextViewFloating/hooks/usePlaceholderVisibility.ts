import * as React from 'react';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';

export function usePlaceholderVisibility(isExpanded: SharedValue<boolean>) {
    const [isPlaceholderVisible, setPlaceholderVisible] = React.useState(isExpanded.value);

    /**
     * We need to show the placeholder after the expanding animation ends
     */
    const showPlacehoder = React.useCallback(() => {
        setPlaceholderVisible(true);
    }, []);

    const hidePlacehoder = React.useCallback(() => {
        setPlaceholderVisible(false);
    }, []);

    useAnimatedReaction(
        () => isExpanded.value,
        (expanded, prevExpanded) => {
            if (expanded === prevExpanded) {
                return;
            }
            if (!expanded) {
                runOnJS(hidePlacehoder)();
            }
        },
    );

    return {
        isPlaceholderVisible,
        showPlacehoder,
    };
}
