import * as React from 'react';
import type { GestureRef } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

const HighlightsNativeGestureRefContext = React.createContext<Exclude<GestureRef, number> | null>(
    null,
);

export function useHighlightsNativeGestureRef(): Exclude<GestureRef, number> {
    const gestureRef = React.useContext(HighlightsNativeGestureRefContext);

    if (gestureRef == null) {
        throw new Error('Have you use it inside UIHighlights?');
    }

    return gestureRef;
}

export function HighlightsNativeGestureRefProvider({
    gestureRef,
    children,
}: {
    gestureRef: Exclude<GestureRef, number>;
    children: React.ReactNode;
}) {
    return (
        <HighlightsNativeGestureRefContext.Provider value={gestureRef}>
            {children}
        </HighlightsNativeGestureRefContext.Provider>
    );
}
