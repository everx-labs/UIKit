import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useSheetHeight() {
    const height = useSharedValue(0);
    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            height.value = lHeight;
        },
        [height],
    );

    return {
        height,
        onSheetLayout,
    };
}
