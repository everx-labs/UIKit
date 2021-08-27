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
export type GestureWorkletEventHandler = WorkletEventHandler<PanGestureHandlerGestureEvent>;

export type ScrollableOnScrollHandler =
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;

export type ScrollableGestureHandler = ((event: PanGestureHandlerGestureEvent) => void) | undefined;

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

export function useScrollable() {
    return React.useContext(ScrollableContext);
}

function getWorkletFromParentHandler(parentHandler: any) {
    if (
        parentHandler &&
        'current' in parentHandler &&
        parentHandler.current != null &&
        'worklet' in parentHandler.current &&
        parentHandler.current.worklet != null
    ) {
        return parentHandler.current.worklet;
    }
}

function useParentHandler<EventT>(parentHandler: any) {
    const parentWorkletRef = React.useRef<((event: EventT) => void) | null>(null);
    const callParentRef = React.useRef<((event: EventT) => void) | null>(null);

    if (parentWorkletRef.current == null) {
        parentWorkletRef.current = getWorkletFromParentHandler(parentHandler);
    }

    const parentWorklet = parentWorkletRef.current;

    if (callParentRef.current == null) {
        callParentRef.current = function callParent(event: EventT) {
            'worklet';

            if (parentWorklet) {
                parentWorklet(event);
            }
        };
    }

    return callParentRef.current;
}

export function useScrollableParentScrollHandler() {
    const { scrollHandler: parentScrollHandler } = useScrollable();

    return useParentHandler<NativeScrollEvent>(parentScrollHandler);
}

export function useScrollableParentGestureHandlerHandler() {
    const { gestureHandler: parentGestureHandler } = useScrollable();

    return useParentHandler<PanGestureHandlerGestureEvent['nativeEvent']>(parentGestureHandler);
}
