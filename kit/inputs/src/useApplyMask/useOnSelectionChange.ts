/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export function useOnSelectionChange(onSelectionChangeProp: TextInputProps['onSelectionChange']) {
    const selectionEnd = useSharedValue(0);
    const skipNextOnSelectionChange = useSharedValue(false);

    const onSelectionChange = React.useCallback(
        function onSelectionChange(e) {
            const {
                nativeEvent: {
                    selection: { end },
                },
            } = e;
            if (skipNextOnSelectionChange.value) {
                skipNextOnSelectionChange.value = false;
                return;
            }
            selectionEnd.value = end;
            onSelectionChangeProp?.(e);
        },
        [selectionEnd, skipNextOnSelectionChange, onSelectionChangeProp],
    );

    return {
        selectionEnd,
        onSelectionChange,
        skipNextOnSelectionChange,
    };
}
