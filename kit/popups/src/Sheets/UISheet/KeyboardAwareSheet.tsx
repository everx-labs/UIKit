import * as React from 'react';
import Animated, { useDerivedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnimatedKeyboardHeight } from '@tonlabs/uikit.inputs';
import { SheetOriginContext } from './SheetOriginContext';

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
    const insets = useSafeAreaInsets();
    const keyboardHeight = useAnimatedKeyboardHeight();

    const bottomInset = useDerivedValue(() => {
        return withSpring(getBottomInset(insets.bottom, keyboardHeight.value), {
            overshootClamping: true,
        });
    });

    const origin = useDerivedValue(() => {
        return 0 - defaultShift - keyboardHeight.value - bottomInset.value;
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
    getBottomInset = getZeroBottomInset,
}: KeyboardAwareSheetProps) {
    const insets = useSafeAreaInsets();

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
