/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useOnSelectionChange() {
    const selectionStart = useSharedValue(0);
    const selectionEnd = useSharedValue(0);
    const skipNextOnSelectionChange = useSharedValue(false);

    const onSelectionChange = React.useCallback(
        function onSelectionChange({
            nativeEvent: {
                selection: { start, end },
            },
        }) {
            if (skipNextOnSelectionChange.value) {
                skipNextOnSelectionChange.value = false;
                return;
            }
            selectionStart.value = start;
            selectionEnd.value = end;
        },
        [selectionStart, selectionEnd, skipNextOnSelectionChange],
    );
    return {
        selectionStart,
        selectionEnd,
        onSelectionChange,
        skipNextOnSelectionChange,
    };
}
