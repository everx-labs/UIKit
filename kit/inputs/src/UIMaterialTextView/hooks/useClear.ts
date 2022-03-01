import * as React from 'react';

export function useClear(resetInputHeight: () => void, onChangeText: (text: string) => void) {
    return React.useCallback(
        function clear() {
            resetInputHeight();
            onChangeText('');
        },
        [resetInputHeight, onChangeText],
    );
}
