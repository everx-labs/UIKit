import * as React from 'react';
import type { UITextViewRef } from '../../UITextView';
import type { ImperativeChangeText } from '../types';

export function useClear(
    imperativeChangeText: ImperativeChangeText,
    ref: React.RefObject<UITextViewRef>,
) {
    return React.useCallback(
        function clear() {
            imperativeChangeText('');
            ref.current?.remeasureInputHeight();
            ref.current?.focus();
        },
        [imperativeChangeText, ref],
    );
}
