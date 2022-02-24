/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { UIMaterialTextViewMask, UIMaterialTextViewRef } from '../UIMaterialTextView/types';
import { onChangeAmount } from './onChangeAmount';
import { useOnSelectionChange } from './useOnSelectionChange';

export function useApplyMask(
    textViewRef: React.RefObject<UIMaterialTextViewRef>,
    mask?: UIMaterialTextViewMask,
) {
    const { selectionStart, selectionEnd, onSelectionChange } = useOnSelectionChange();

    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const onChangeText = React.useCallback(
        (rawNumber: string): void => {
            switch (mask) {
                case '[000] [000].[000] [000]':
                    return onChangeAmount(
                        rawNumber,
                        textViewRef,
                        selectionStart,
                        selectionEnd,
                        lastNormalizedText,
                        lastText,
                    );
                default:
                    return undefined;
            }
        },
        [textViewRef, mask, selectionStart, selectionEnd, lastNormalizedText, lastText],
    );
    return {
        onSelectionChange,
        onChangeText,
    };
}
