/* eslint-disable no-param-reassign */
import * as React from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import type { ImperativeChangeText, MoveCarret } from '../../UIMaterialTextView/types';
import { onChangeAmount } from './onChangeAmount';

export function useApplyMaskAmount(
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
    selectionEnd: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
) {
    const lastNormalizedText = useSharedValue('');
    const lastText = useSharedValue('');

    const onChangeText = React.useCallback(
        (text: string): void => {
            onChangeAmount(
                text,
                selectionEnd,
                lastNormalizedText,
                lastText,
                imperativeChangeText,
                moveCarret,
                skipNextOnSelectionChange,
            );
        },
        [
            selectionEnd,
            lastNormalizedText,
            lastText,
            imperativeChangeText,
            moveCarret,
            skipNextOnSelectionChange,
        ],
    );

    return {
        onChangeText,
    };
}
