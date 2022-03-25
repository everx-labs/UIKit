import * as React from 'react';
import type { TextInput } from 'react-native';
import type { ImperativeChangeText } from '../types';

export function useClear(
    resetInputHeight: () => void,
    imperativeChangeText: ImperativeChangeText,
    ref: React.RefObject<TextInput>,
) {
    return React.useCallback(
        function clear() {
            resetInputHeight();
            imperativeChangeText('');
            ref.current?.blur();
        },
        [resetInputHeight, imperativeChangeText, ref],
    );
}
