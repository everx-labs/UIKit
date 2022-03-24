import * as React from 'react';
import { TextInput } from 'react-native';
import type { UIMaterialTextViewRef, ChangeText, ImperativeChangeText, MoveCarret } from '../types';

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
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
) {
    const changeText: ChangeText = React.useCallback(
        function changeText(text: string, callOnChangeProp: boolean | undefined) {
            imperativeChangeText(text, {
                callOnChangeProp,
            });
        },
        [imperativeChangeText],
    );

    React.useImperativeHandle<TextInput, UIMaterialTextViewRef>(
        forwardedRed,
        (): UIMaterialTextViewRef => ({
            ...(localRef.current ? localRef.current : TextInput.prototype),
            setState: getEmptyMethod('setState'),
            forceUpdate: getEmptyMethod('forceUpdate'),
            render: getEmptyMethod('render'),
            changeText,
            moveCarret,
        }),
    );
}
