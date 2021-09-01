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

export function getWorkletFromParentHandler(parentHandler: any) {
    if (
        parentHandler &&
        'current' in parentHandler &&
        parentHandler.current != null &&
        'worklet' in parentHandler.current &&
        parentHandler.current.worklet != null
    ) {
        return parentHandler.current.worklet;
    }
    return null;
}

/**
 * Here we implement our own version of event propagation
 * as there is no way to bubble events for scrollables.
 * We use regular React context, to pass handlers,
 * so we can access parent ones.
 *
 * We have to bubble event in some situations if it's needed,
 * for example for UISheet, when it contains UILargeTitleHeader.
 *
 * Here we use the fact that useAnimatedScrollHandler uses WorkletEventHandler
 * https://github.com/software-mansion/react-native-reanimated/blob/0c2f66f9855a26efe24f52ecff927fe847f7a80e/src/reanimated2/WorkletEventHandler.ts#L11
 * under the hood
 */
type ParentHandler<EventT> = (event: EventT) => void;
function useParentHandler<EventT>(parentHandler: any) {
    const parentWorkletRef = React.useRef<((event: EventT) => void) | null>(null);
    const callParentRef = React.useRef<ParentHandler<EventT> | null>(null);

    if (parentWorkletRef.current == null) {
        parentWorkletRef.current = getWorkletFromParentHandler(parentHandler);
    }

    const parentWorklet = parentWorkletRef.current;

    if (callParentRef.current == null) {
        callParentRef.current = function callParentHandler(event: EventT) {
            'worklet';

            if (parentWorklet) {
                parentWorklet(event);
            }
        };
    }

    return {
        parentHandler: callParentRef.current,
        parentHandlerActive: parentWorkletRef.current != null,
    };
}

export type ScrollableParentScrollHandler = ParentHandler<NativeScrollEvent>;
export function useScrollableParentScrollHandler() {
    const { scrollHandler: parentScrollHandler } = useScrollable();

    return useParentHandler<NativeScrollEvent>(parentScrollHandler);
}

export type ScrollableParentGestureHandlerHandler = ParentHandler<
    PanGestureHandlerGestureEvent['nativeEvent']
>;
export function useScrollableParentGestureHandlerHandler() {
    const { gestureHandler: parentGestureHandler } = useScrollable();

    return useParentHandler<PanGestureHandlerGestureEvent['nativeEvent']>(parentGestureHandler);
}
