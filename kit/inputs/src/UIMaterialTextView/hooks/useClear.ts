import * as React from 'react';
import type { TextInput } from 'react-native';

export function useClear(
    resetInputHeight: () => void,
    onChangeText: (text: string) => void,
    ref: React.RefObject<TextInput>,
) {
    return React.useCallback(
        function clear() {
            ref.current?.clear();
            ref.current?.blur();
            onChangeText('');
            resetInputHeight();
        },
        [resetInputHeight, onChangeText, ref],
    );
}
