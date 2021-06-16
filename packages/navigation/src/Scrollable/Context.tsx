import * as React from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

export const ScrollableContext = React.createContext<{
    ref: React.Ref<Animated.ScrollView>;
    scrollHandler:
        | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
        | undefined;
    gestureHandler:
        | ((event: PanGestureHandlerGestureEvent) => void)
        | undefined;
    onWheel: ((event: any) => void) | null;
    registerScrollable: (() => void) | null;
    unregisterScrollable: (() => void) | null;
    hasScroll: boolean;
    setHasScroll: ((hasScroll: boolean) => void) | undefined;
}>({
    ref: null,
    scrollHandler: undefined,
    gestureHandler: undefined,
    onWheel: null,
    registerScrollable: null,
    unregisterScrollable: null,
    hasScroll: false,
    setHasScroll: undefined,
});
