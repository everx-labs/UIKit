/* eslint-disable no-param-reassign */
import * as React from 'react';
import type { TextInputProps, TextInputSelectionChangeEventData } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

export function useOnSelectionChange(onSelectionChangeProp: TextInputProps['onSelectionChange']) {
    const selectionEnd = useSharedValue(0);
    const skipNextOnSelectionChange = useSharedValue(false);

    const onSelectionChange = React.useCallback(
        function onSelectionChange(evt: TextInputSelectionChangeEventData) {
            'worklet';

            if (skipNextOnSelectionChange.value) {
                skipNextOnSelectionChange.value = false;
                return;
            }

            selectionEnd.value = evt.selection.end;

            if (onSelectionChangeProp != null) {
                runOnJS(onSelectionChangeProp)({ nativeEvent: evt } as any);
            }
        },
        [selectionEnd, skipNextOnSelectionChange, onSelectionChangeProp],
    );

    return {
        selectionEnd,
        skipNextOnSelectionChange,
        onSelectionChange,
    };
}
