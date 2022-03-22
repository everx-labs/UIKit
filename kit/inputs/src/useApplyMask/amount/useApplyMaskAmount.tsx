/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { ImperativeChangeText, MoveCarret } from '../../UIMaterialTextView/types';
import { onChangeAmount } from './onChangeAmount';
import { useOnSelectionChange } from '../useOnSelectionChange';

export function useApplyMaskAmount(
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
) {
    const { selectionEnd, onSelectionChange, skipNextOnSelectionChange } = useOnSelectionChange();

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
        onSelectionChange,
        onChangeText,
    };
}
