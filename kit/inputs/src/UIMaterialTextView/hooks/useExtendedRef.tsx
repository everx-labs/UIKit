import * as React from 'react';
import type { TextInput } from 'react-native';
import type { UIMaterialTextViewRef, ChangeText, MoveCarret } from '../types';

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    changeText: ChangeText,
    moveCarret: MoveCarret,
) {
    React.useImperativeHandle(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            ...localRef.current,
            setNativeProps(...args) {
                return localRef.current?.setNativeProps(...args);
            },
            changeText,
            moveCarret,
        }),
    );
}
