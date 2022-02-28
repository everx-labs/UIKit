/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewMask, ChangeText, MoveCarret } from '../UIMaterialTextView/types';
import { onChangeAmount } from './onChangeAmount';
import { useOnSelectionChange } from './useOnSelectionChange';

export function useApplyMask(
    changeText: ChangeText,
    moveCarret: MoveCarret,
    mask?: UIMaterialTextViewMask,
) {
    const { selectionStart, selectionEnd, onSelectionChange, skipNextOnSelectionChange } =
        useOnSelectionChange();

    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const onChangeText = React.useCallback(
        (rawNumber: string): void => {
            switch (mask) {
                case '[000] [000].[000] [000]':
                    onChangeAmount(
                        rawNumber,
                        selectionStart,
                        selectionEnd,
                        lastNormalizedText,
                        lastText,
                        changeText,
                        moveCarret,
                        skipNextOnSelectionChange,
                    );
                    break;
                default:
                    break;
            }
        },
        [
            mask,
            selectionStart,
            selectionEnd,
            lastNormalizedText,
            lastText,
            changeText,
            moveCarret,
            skipNextOnSelectionChange,
        ],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}
