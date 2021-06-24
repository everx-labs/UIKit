import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

/**
 * Use it in pair with ScrolableContext
 */
export function useHasScroll() {
    const [hasScroll, setHasScroll] = React.useState(false);
    const hasScrollShared = useSharedValue(false);

    const setHasScrollGuarded = React.useCallback(
        (newHasScroll) => {
            if (newHasScroll !== hasScroll) {
                setHasScroll(newHasScroll);
                hasScrollShared.value = newHasScroll;
            }
        },
        [hasScroll, setHasScroll, hasScrollShared],
    );

    return {
        hasScroll,
        hasScrollShared,
        setHasScroll: setHasScrollGuarded,
    };
}
