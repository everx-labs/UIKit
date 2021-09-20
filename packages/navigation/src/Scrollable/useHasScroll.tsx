import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { ScrollableContext } from './Context';

/**
 * Use it in pair with ScrolableContext
 */
export function useHasScroll() {
    const { setHasScroll: parentSetHasScroll } = React.useContext(ScrollableContext);
    const [hasScroll, setHasScroll] = React.useState(false);
    const hasScrollShared = useSharedValue(false);

    const setHasScrollGuarded = React.useCallback(
        newHasScroll => {
            if (newHasScroll !== hasScroll) {
                setHasScroll(newHasScroll);
                hasScrollShared.value = newHasScroll;

                if (parentSetHasScroll) {
                    parentSetHasScroll(newHasScroll);
                }
            }
        },
        [hasScroll, setHasScroll, hasScrollShared, parentSetHasScroll],
    );

    return {
        hasScroll,
        hasScrollShared,
        setHasScroll: setHasScrollGuarded,
    };
}
