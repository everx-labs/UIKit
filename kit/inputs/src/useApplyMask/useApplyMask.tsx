/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type {
    UIMaterialTextViewMask,
    ImperativeChangeText,
    MoveCarret,
} from '../UIMaterialTextView/types';
import { onChangeAmount } from './amount';
import { useOnSelectionChange } from './useOnSelectionChange';

export function useApplyMask(
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
    mask: UIMaterialTextViewMask | undefined,
) {
    const { selectionEnd, onSelectionChange, skipNextOnSelectionChange } = useOnSelectionChange();

    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const onChangeText = React.useCallback(
        (text: string): void => {
            switch (mask) {
                case 'Amount':
                    onChangeAmount(
                        text,
                        selectionEnd,
                        lastNormalizedText,
                        lastText,
                        imperativeChangeText,
                        moveCarret,
                        skipNextOnSelectionChange,
                    );
                    break;
                default:
                    /**
                     * If the text is empty, then the Clear button may have been pressed,
                     * if so we must call `setNativeProps` to clear the input
                     */
                    if (!text) {
                        imperativeChangeText(text);
                    } else {
                        imperativeChangeText(text, {
                            shouldSetNativeProps: false,
                        });
                    }
            }
        },
        [
            mask,
            selectionEnd,
            lastNormalizedText,
            lastText,
            imperativeChangeText,
            moveCarret,
            skipNextOnSelectionChange,
        ],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}
