import * as React from 'react';
import {
    GestureEvent,
    TapGestureHandler,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';
import type { UITextViewRef } from '../UITextView';
import { AmountInputContext } from './constants';

export function TapHandler({
    children,
    inputRef,
}: {
    children: React.ReactNode;
    inputRef: React.RefObject<UITextViewRef>;
}) {
    const { isFocused } = React.useContext(AmountInputContext);

    const focus = React.useCallback(() => {
        if (!isFocused.value) {
            inputRef.current?.focus();
        }
    }, [isFocused, inputRef]);

    const animatedGestureHandler = useAnimatedGestureHandler<
        GestureEvent<TapGestureHandlerEventPayload>
    >({
        onEnd: () => {
            runOnJS(focus)();
        },
    });

    return (
        <TapGestureHandler onHandlerStateChange={animatedGestureHandler} shouldCancelWhenOutside>
            {children}
        </TapGestureHandler>
    );
}
