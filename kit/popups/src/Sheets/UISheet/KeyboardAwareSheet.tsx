import * as React from 'react';
import { useDerivedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnimatedKeyboardHeight } from '@tonlabs/uikit.inputs';
import { SheetOriginContext } from './SheetOriginContext';

function getZeroBottomInset() {
    'worklet';

    return 0;
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

    return <SheetOriginContext.Provider value={origin}>{children}</SheetOriginContext.Provider>;
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

    return <SheetOriginContext.Provider value={origin}>{children}</SheetOriginContext.Provider>;
}
