import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useSheetHeight(
    rubberBandEffectDistance: number,
    countRubberBandDistance?: boolean,
) {
    const height = useSharedValue(0);
    const onSheetLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            const newHeight = countRubberBandDistance
                ? lHeight - rubberBandEffectDistance
                : lHeight;
            height.value = newHeight;
        },
        [height, countRubberBandDistance, rubberBandEffectDistance],
    );

    return {
        height,
        onSheetLayout,
    };
}
