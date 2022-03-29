import * as React from 'react';
import type { TextInput } from 'react-native';
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

export function useImperativeChange(ref: React.RefObject<TextInput>, onChangeText: ChangeText) {
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

            onChangeText(text, callOnChangeProp);
        },
        [ref, onChangeText],
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
