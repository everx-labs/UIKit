import * as React from 'react';
import { Platform } from 'react-native';
import { moveCarret as moveCarretPlatform } from '../../moveCarret';
import type { UITextViewRef } from '../../UITextView';
import type {
    ImperativeChangeText,
    UIMaterialTextViewRefMoveCarret,
    ImperativeChangeTextConfig,
    UIMaterialTextViewApplyMask,
} from '../types';
import { useCallWithTimeOut } from './useCallWithTimeOut';

const defultConfig = {
    callOnChangeProp: true,
    shouldSetNativeProps: true,
};

export function useImperativeChange(
    ref: React.RefObject<UITextViewRef>,
    onChangeTextProp: ((text: string) => void) | undefined,
    checkInputHasValue: (text: string) => string,
    applyMask: UIMaterialTextViewApplyMask,
) {
    const moveCarret: UIMaterialTextViewRefMoveCarret = React.useCallback(
        function moveCarret(carretPosition: number, maxPosition?: number) {
            moveCarretPlatform(ref, carretPosition, maxPosition);
        },
        [ref],
    );

    const onChangeTextPropWithTimeOut = useCallWithTimeOut(onChangeTextProp);

    const imperativeChangeText: ImperativeChangeText = React.useCallback(
        function imperativeChangeText(
            text: string,
            config: ImperativeChangeTextConfig | undefined = defultConfig,
        ) {
            const {
                callOnChangeProp = defultConfig.callOnChangeProp,
                shouldSetNativeProps = defultConfig.shouldSetNativeProps,
            } = config;

            const { formattedText, carretPosition } = applyMask(text);

            checkInputHasValue(formattedText);

            if (shouldSetNativeProps || text !== formattedText) {
                ref.current?.setNativeProps({
                    text: formattedText,
                });
            }

            if (
                Platform.OS === 'web' &&
                ref.current?.isFocused() !== false &&
                carretPosition != null
            ) {
                moveCarret(carretPosition, formattedText.length);
            }

            if (callOnChangeProp) {
                /**
                 * timeout is used so that input changes are not slowed down
                 * by heavy execution of onChangeTextProp
                 */
                onChangeTextPropWithTimeOut(formattedText);
            }
        },
        [ref, checkInputHasValue, applyMask, moveCarret, onChangeTextPropWithTimeOut],
    );

    return {
        imperativeChangeText,
        moveCarret,
    };
}
