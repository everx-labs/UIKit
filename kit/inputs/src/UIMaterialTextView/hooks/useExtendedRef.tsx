import * as React from 'react';
import { TextInput } from 'react-native';
import type { UIMaterialTextViewRef, ChangeText, MoveCarret } from '../types';

function getEmptyMethod(name: string) {
    return function emptyMethod() {
        console.error(
            `[useExtendedRef]: You tried to call method [${name}]. This method is not implemented.`,
        );
        return null;
    };
}

export function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    changeText: ChangeText,
    moveCarret: MoveCarret,
) {
    React.useImperativeHandle<TextInput, UIMaterialTextViewRef>(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            ...(localRef.current ? localRef.current : new TextInput({})),
            setState: getEmptyMethod('setState'),
            forceUpdate: getEmptyMethod('forceUpdate'),
            render: getEmptyMethod('render'),
            changeText,
            moveCarret,
        }),
    );
}
