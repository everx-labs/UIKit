/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useOnSelectionChange() {
    const selectionEnd = useSharedValue(0);
    const skipNextOnSelectionChange = useSharedValue(false);

    const onSelectionChange = React.useCallback(
        function onSelectionChange({
            nativeEvent: {
                selection: { end },
            },
        }) {
            if (skipNextOnSelectionChange.value) {
                skipNextOnSelectionChange.value = false;
                return;
            }
            selectionEnd.value = end;
        },
        [selectionEnd, skipNextOnSelectionChange],
    );

    return {
        selectionEnd,
        onSelectionChange,
        skipNextOnSelectionChange,
    };
}
