import * as React from 'react';
import { Platform } from 'react-native';
import { moveCarret as moveCarretPlatform } from '../../moveCarret';
import type { UITextViewRef } from '../../UITextView';
import type {
    ImperativeChangeText,
    MaterialTextViewRefMoveCarret,
    ImperativeChangeTextConfig,
    MaterialTextViewApplyMask,
} from '../types';
import { useCallWithTimeOut } from './useCallWithTimeOut';

const defaultConfig = {
    callOnChangeProp: true,
    shouldSetNativeProps: true,
};

export function useImperativeChange(
    ref: React.RefObject<UITextViewRef>,
    onChangeTextProp: ((text: string) => void) | undefined,
    checkInputHasValue: (text: string) => void,
    applyMask: MaterialTextViewApplyMask,
) {
    const moveCarret: MaterialTextViewRefMoveCarret = React.useCallback(
        function moveCarret(carretPosition: number, maxPosition?: number) {
            moveCarretPlatform(ref, carretPosition, maxPosition);
        },
        [ref],
    );

    const onChangeTextPropWithTimeOut = useCallWithTimeOut(
        React.useCallback(
            (text: string) => requestAnimationFrame(() => onChangeTextProp?.(text)),
            [onChangeTextProp],
        ),
    );

    const applyTextChange = React.useCallback(
        (
            formattedText: string,
            carretPosition: number | null,
            config: ImperativeChangeTextConfig | undefined = defaultConfig,
        ) => {
            const {
                callOnChangeProp = defaultConfig.callOnChangeProp,
                shouldSetNativeProps = defaultConfig.shouldSetNativeProps,
            } = config;

            if (shouldSetNativeProps) {
                ref.current?.setNativeProps({
                    text: formattedText,
                });
                ref.current?.remeasureInputHeight();
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
        [ref, moveCarret, onChangeTextPropWithTimeOut],
    );

    const imperativeChangeText: ImperativeChangeText = React.useCallback(
        function imperativeChangeText(
            text: string,
            config: ImperativeChangeTextConfig = defaultConfig,
        ) {
            const {
                callOnChangeProp = defaultConfig.callOnChangeProp,
                shouldSetNativeProps = defaultConfig.shouldSetNativeProps,
            } = config;
            const { formattedText, carretPosition } = applyMask(text);

            checkInputHasValue(formattedText);

            applyTextChange(formattedText, carretPosition, {
                callOnChangeProp,
                shouldSetNativeProps: shouldSetNativeProps || text !== formattedText,
            });
        },
        [checkInputHasValue, applyMask, applyTextChange],
    );

    return {
        imperativeChangeText,
        moveCarret,
        applyTextChange,
    };
}
