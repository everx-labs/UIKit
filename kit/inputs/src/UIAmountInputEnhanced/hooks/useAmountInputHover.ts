import * as React from 'react';
import { runOnJS, useWorkletCallback } from 'react-native-reanimated';
import { AmountInputContext } from '../constants';

export function useAmountInputHover(onHoverProp: ((isHovered: boolean) => void) | undefined) {
    const { isHovered } = React.useContext(AmountInputContext);

    const onMouseEnter = useWorkletCallback(function onMouseEnter() {
        'worklet';

        if (onHoverProp) {
            runOnJS(onHoverProp)(true);
        }
        isHovered.value = true;
    });
    const onMouseLeave = useWorkletCallback(function onMouseLeave() {
        'worklet';

        if (onHoverProp) {
            runOnJS(onHoverProp)(false);
        }
        isHovered.value = false;
    });

    return { onMouseEnter, onMouseLeave };
}
