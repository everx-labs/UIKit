import * as React from 'react';
import type { GestureType } from 'react-native-gesture-handler';

type HighlightsScrollRefContextT = React.RefObject<GestureType> | null;

const HighlightsScrollRefContext = React.createContext<HighlightsScrollRefContextT>(null);

export function useHightlightsScrollRef() {
    const scrollRef = React.useContext(HighlightsScrollRefContext);

    if (scrollRef == null) {
        throw new Error('Have you use it inside UIHighlights?');
    }

    return scrollRef;
}

export function HighlightsScrollRefProvider({
    scrollRef,
    children,
}: {
    scrollRef: React.RefObject<GestureType>;
    children: React.ReactNode;
}) {
    return (
        <HighlightsScrollRefContext.Provider value={scrollRef}>
            {children}
        </HighlightsScrollRefContext.Provider>
    );
}
