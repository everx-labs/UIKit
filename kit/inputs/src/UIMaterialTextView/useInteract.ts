import * as React from 'react';
import { Platform, TextInput } from 'react-native';
import { calculateWebInputHeight } from '../useAutogrowTextView';
import { moveCarret as moveCarretPlatform } from '../moveCarret';
import type { ChangeText } from './types';

export function useInteract(
    ref: React.RefObject<TextInput>,
    multiline: boolean | undefined,
    onChangeText: ChangeText,
    onClear: (() => void) | undefined,
) {
    const changeText = React.useCallback(
        function changeText(text: string, callOnChangeProp?: boolean) {
            ref.current?.setNativeProps({
                text,
            });

            if (multiline) {
                if (Platform.OS === 'web') {
                    const elem = ref.current as unknown as HTMLTextAreaElement;
                    calculateWebInputHeight(elem);
                }
            }

            onChangeText(text, callOnChangeProp);
        },
        [ref, multiline, onChangeText],
    );

    const moveCarret = React.useCallback(
        function moveCarret(carretPosition: number, maxPosition?: number) {
            moveCarretPlatform(ref, carretPosition, maxPosition);
        },
        [ref],
    );

    const clear = React.useCallback(
        function clear() {
            onClear?.();
            changeText('');
        },
        [onClear, changeText],
    );

    return {
        changeText,
        moveCarret,
        clear,
    };
}
