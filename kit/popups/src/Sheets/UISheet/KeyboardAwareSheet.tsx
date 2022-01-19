import * as React from 'react';
import type Animated from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnimatedKeyboardHeight } from '@tonlabs/uikit.inputs';

function getZeroBottomInset() {
    'worklet';

    return 0;
}

type KeyboardAwareSheetContextT = {
    origin: Animated.SharedValue<number>;
    bottomInset: Animated.SharedValue<number>;
};

const KeyboardAwareSheetContext = React.createContext<KeyboardAwareSheetContextT | null>(null);

export function useKeyboardAwareSheet() {
    const opts = React.useContext(KeyboardAwareSheetContext);

    if (opts == null) {
        throw new Error(
            'Have you forgot to wrap <UISheet.Content /> with <UISheet.Keyboard[Un]aware /> ?',
        );
    }

    return opts;
}

type KeyboardAwareSheetProps = {
    children: React.ReactNode;
    defaultShift?: number;
    /**
     * IMPORTANT: should be a worklet!
     */
    getBottomInset?: (bottomInset: number, keyboardHeight: number) => number;
};

export function KeyboardAwareSheet({
    children,
    defaultShift = 0,
    getBottomInset = getZeroBottomInset,
}: KeyboardAwareSheetProps) {
    const keyboardHeight = useAnimatedKeyboardHeight();

    const origin = useDerivedValue(() => {
        return 0 - defaultShift - keyboardHeight.value;
    });

    const insets = useSafeAreaInsets();

    const bottomInset = useDerivedValue(() => {
        return getBottomInset(insets.bottom, keyboardHeight.value);
    });

    const contextValue = React.useRef<KeyboardAwareSheetContextT>();

    if (contextValue.current == null) {
        contextValue.current = {
            origin,
            bottomInset,
        };
    }

    return (
        <KeyboardAwareSheetContext.Provider value={contextValue.current}>
            {children}
        </KeyboardAwareSheetContext.Provider>
    );
}

export function KeyboardUnawareSheet({
    children,
    defaultShift = 0,
    getBottomInset = getZeroBottomInset,
}: KeyboardAwareSheetProps) {
    const origin = useDerivedValue(() => {
        return 0 - defaultShift;
    });

    const insets = useSafeAreaInsets();

    const bottomInset = useDerivedValue(() => {
        return getBottomInset(insets.bottom, 0);
    });

    const contextValue = React.useRef<KeyboardAwareSheetContextT>();

    if (contextValue.current == null) {
        contextValue.current = {
            origin,
            bottomInset,
        };
    }

    return (
        <KeyboardAwareSheetContext.Provider value={contextValue.current}>
            {children}
        </KeyboardAwareSheetContext.Provider>
    );
}
