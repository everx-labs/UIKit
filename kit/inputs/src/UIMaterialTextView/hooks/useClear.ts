import * as React from 'react';
import type { TextInput } from 'react-native';
import type { ImperativeChangeText } from '../types';

export function useClear(
    remeasureInputHeight: () => void,
    imperativeChangeText: ImperativeChangeText,
    ref: React.RefObject<TextInput>,
) {
    return React.useCallback(
        function clear() {
            imperativeChangeText('');
            ref.current?.clear();
            ref.current?.blur();
            remeasureInputHeight();
        },
        [remeasureInputHeight, imperativeChangeText, ref],
    );
}
