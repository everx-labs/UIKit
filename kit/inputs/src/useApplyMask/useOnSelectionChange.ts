/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useOnSelectionChange() {
    const selectionStart = useSharedValue(0);
    const selectionEnd = useSharedValue(0);
    const onSelectionChange = React.useCallback(
        ({
            nativeEvent: {
                selection: { start, end },
            },
        }) => {
            console.log('onSelectionChange', { start, end });
            selectionStart.value = start;
            selectionEnd.value = end;
        },
        [selectionStart, selectionEnd],
    );
    return {
        selectionStart,
        selectionEnd,
        onSelectionChange,
    };
}
