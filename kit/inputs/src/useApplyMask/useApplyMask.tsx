/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { moveCarret } from '../moveCarret';
import type { UIMaterialTextViewMask, UIMaterialTextViewRef } from '../UIMaterialTextView/types';
import { onChangeAmount } from './onChangeAmount';
import type { MoveCarret, SetText } from './types';
import { useOnSelectionChange } from './useOnSelectionChange';

const useSetTest = (ref: React.RefObject<UIMaterialTextViewRef>) => {
    return React.useCallback(
        (formattedNumber: string) => {
            // console.log('useSetTest', { formattedNumber });
            // Set it to text input
            // To avoid re-rendering
            if (ref && 'current' in ref && ref.current) {
                ref.current?.setNativeProps({
                    text: formattedNumber,
                });
                // moveCarret(ref, carretPosition, formattedNumber.length);
            }
        },
        [ref],
    );
};

const useMoveCarret = (ref: React.RefObject<UIMaterialTextViewRef>) => {
    return React.useCallback(
        (carretPosition: number, maxPosition?: number) => {
            // console.log('useMoveCarret', {
            //     carretPosition,
            //     maxPosition,
            // });
            if (ref && 'current' in ref && ref.current) {
                moveCarret(ref, carretPosition, maxPosition);
            }
        },
        [ref],
    );
};

export function useApplyMask(
    ref: React.RefObject<UIMaterialTextViewRef>,
    mask?: UIMaterialTextViewMask,
) {
    const { selectionStart, selectionEnd, onSelectionChange } = useOnSelectionChange();

    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const setText: SetText = useSetTest(ref);
    const moveCarretCallback: MoveCarret = useMoveCarret(ref);

    const onChangeText = React.useCallback(
        (rawNumber: string): void => {
            switch (mask) {
                case '[000] [000].[000] [000]':
                    return onChangeAmount(
                        rawNumber,
                        selectionStart,
                        selectionEnd,
                        lastNormalizedText,
                        lastText,
                        setText,
                        moveCarretCallback,
                    );
                default:
                    return undefined;
            }
        },
        [
            mask,
            selectionStart,
            selectionEnd,
            lastNormalizedText,
            lastText,
            setText,
            moveCarretCallback,
        ],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}
