import * as React from 'react';

import { useKeyboard } from '@react-native-community/hooks';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Platform } from 'react-native';

import { useSheetBottomInset } from './KeyboardAwareSheet';

function calcSheetWithKeyboardIntersection(keyboardHeight: number, sheetBottomInset: number) {
    'worklet';

    return Math.max(0, keyboardHeight - sheetBottomInset);
}

export function useInSheetKeyboard() {
    const { keyboardShown, keyboardHeight } = useKeyboard();

    const kHeight = React.useMemo(() => {
        // As for now we use `adjustResize`
        if (Platform.OS === 'android') {
            return 0;
        }
        return keyboardShown ? 0 : keyboardHeight;
    }, [keyboardHeight, keyboardShown]);

    const sheetBottomInset = useSheetBottomInset();

    const heightHolderRef = React.useRef(
        calcSheetWithKeyboardIntersection(kHeight, sheetBottomInset.value),
    );
    const [height, setHeight] = React.useState(heightHolderRef.current);

    const setInSheetKeyboardHeight = React.useCallback((h: number) => {
        if (heightHolderRef.current === h) {
            return;
        }

        heightHolderRef.current = h;
        // Force re-render
        setHeight(h);
    }, []);

    useAnimatedReaction(
        () => calcSheetWithKeyboardIntersection(kHeight, sheetBottomInset.value),
        sheetWithKeyboardIntersection => {
            runOnJS(setInSheetKeyboardHeight)(sheetWithKeyboardIntersection);
        },
    );

    return {
        height,
    };
}
