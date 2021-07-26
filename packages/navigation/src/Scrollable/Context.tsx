import * as React from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type Animated from 'react-native-reanimated';
import type {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export type ScrollWorkletEventHandler = WorkletEventHandler<
    NativeSyntheticEvent<NativeScrollEvent>
>;
export type GestureWorkletEventHandler = WorkletEventHandler<
    PanGestureHandlerGestureEvent
>;

export type ScrollableOnScrollHandler =
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;

export type ScrollableGestureHandler =
    | ((event: PanGestureHandlerGestureEvent) => void)
    | undefined;

export type SetHasScroll = ((hasScroll: boolean) => void) | undefined;

export const ScrollableContext = React.createContext<{
    ref: React.RefObject<Animated.ScrollView> | null;
    panGestureHandlerRef: React.Ref<PanGestureHandler>;
    scrollHandler: ScrollableOnScrollHandler;
    gestureHandler: ScrollableGestureHandler;
    onWheel: ((event: any) => void) | null;
    registerScrollable: (() => void) | null;
    unregisterScrollable: (() => void) | null;
    hasScroll: boolean;
    setHasScroll: SetHasScroll;
}>({
    ref: null,
    panGestureHandlerRef: null,
    scrollHandler: undefined,
    gestureHandler: undefined,
    onWheel: null,
    registerScrollable: null,
    unregisterScrollable: null,
    hasScroll: false,
    setHasScroll: undefined,
});
