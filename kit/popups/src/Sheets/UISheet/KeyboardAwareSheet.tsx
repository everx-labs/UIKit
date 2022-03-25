import * as React from 'react';
import Animated, { useDerivedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardBottomInset } from '@tonlabs/uicast.keyboard';
import { SheetOriginContext } from './SheetOriginContext';

// @inline
const DEFAULT_BOTTOM_INSET = 16; // UILayoutConstant.contentOffset

function getDefaultBottomInset(bottomInset: number, keyboardBottomInset: number) {
    'worklet';

    const inset = Math.max(DEFAULT_BOTTOM_INSET, bottomInset);

    if (keyboardBottomInset > inset) {
        return DEFAULT_BOTTOM_INSET;
    }

    return inset;
}

function getZeroBottomInset() {
    'worklet';

    return 0;
}

const SheetBottomInsetContext = React.createContext<Animated.SharedValue<number> | null>(null);

export function useSheetBottomInset() {
    const bottomInset = React.useContext(SheetBottomInsetContext);

    if (bottomInset == null) {
        throw new Error(
            'Have you forgot to wrap <UISheet.Content /> with <SheetBottomInsetContext /> ?',
        );
    }

    return bottomInset;
}

export type KeyboardAwareSheetProps = {
    children: React.ReactNode;
    defaultShift?: number;
    hasDefaultInset?: boolean;
    /**
     * IMPORTANT: should be a worklet!
     */
    getBottomInset?: (bottomInset: number, keyboardBottomInset: number) => number;
};

export function KeyboardAwareSheet({
    children,
    defaultShift = 0,
    hasDefaultInset = false,
    getBottomInset: getBottomInsetProp,
}: KeyboardAwareSheetProps) {
    const insets = useSafeAreaInsets();
    const keyboardBottomInset = useKeyboardBottomInset();

    const getBottomInset =
        getBottomInsetProp || (hasDefaultInset ? getDefaultBottomInset : getZeroBottomInset);

    const bottomInset = useDerivedValue(() => {
        return getBottomInset(insets.bottom, keyboardBottomInset.value);
    });

    const origin = useDerivedValue(() => {
        return 0 - defaultShift - keyboardBottomInset.value - bottomInset.value;
    });

    return (
        <SheetOriginContext.Provider value={origin}>
            <SheetBottomInsetContext.Provider value={bottomInset}>
                {children}
            </SheetBottomInsetContext.Provider>
        </SheetOriginContext.Provider>
    );
}

export function KeyboardUnawareSheet({
    children,
    defaultShift = 0,
    hasDefaultInset = false,
    getBottomInset: getBottomInsetProp,
}: KeyboardAwareSheetProps) {
    const insets = useSafeAreaInsets();

    const getBottomInset =
        getBottomInsetProp || (hasDefaultInset ? getDefaultBottomInset : getZeroBottomInset);

    const bottomInset = useDerivedValue(() => {
        return withSpring(getBottomInset(insets.bottom, 0), { overshootClamping: true });
    });

    const origin = useDerivedValue(() => {
        return 0 - defaultShift - bottomInset.value;
    });

    return (
        <SheetOriginContext.Provider value={origin}>
            <SheetBottomInsetContext.Provider value={bottomInset}>
                {children}
            </SheetBottomInsetContext.Provider>
        </SheetOriginContext.Provider>
    );
}
