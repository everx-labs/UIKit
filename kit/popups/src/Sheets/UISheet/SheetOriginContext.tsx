import * as React from 'react';
import type Animated from 'react-native-reanimated';

export const SheetOriginContext = React.createContext<Animated.SharedValue<number> | null>(null);

export function useSheetOrigin() {
    const opts = React.useContext(SheetOriginContext);

    if (opts == null) {
        throw new Error(
            'Have you forgot to wrap <UISheet.Content /> with <SheetOriginContext /> ?',
        );
    }

    return opts;
}
