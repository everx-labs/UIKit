import * as React from 'react';
import { Platform, TextInput } from 'react-native';
import { calculateWebInputHeight } from '../../useAutogrowTextView';
import { moveCarret as moveCarretPlatform } from '../../moveCarret';
import type {
    ChangeText,
    ImperativeChangeText,
    MoveCarret,
    ImperativeChangeTextConfig,
} from '../types';

const defultConfig = {
    callOnChangeProp: undefined,
    shouldSetNativeProps: true,
};

export function useImperativeChange(
    ref: React.RefObject<TextInput>,
    multiline: boolean | undefined,
    onChangeText: ChangeText,
) {
    const imperativeChangeText: ImperativeChangeText = React.useCallback(
        function imperativeChangeText(
            text: string,
            config: ImperativeChangeTextConfig | undefined = defultConfig,
        ) {
            const {
                callOnChangeProp = defultConfig.callOnChangeProp,
                shouldSetNativeProps = defultConfig.shouldSetNativeProps,
            } = config;

            if (shouldSetNativeProps) {
                ref.current?.setNativeProps({
                    text,
                });
            }

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

    const moveCarret: MoveCarret = React.useCallback(
        function moveCarret(carretPosition: number, maxPosition?: number) {
            moveCarretPlatform(ref, carretPosition, maxPosition);
        },
        [ref],
    );

    return {
        imperativeChangeText,
        moveCarret,
    };
}
