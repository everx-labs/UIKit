import * as React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type {
    UIMaterialTextViewMask,
    UIMaterialTextViewApplyMask,
    UIMaterialTextViewInputState,
} from '../../types';
import { useApplyMaskAmount } from './amount';

function useApplyMaskDefault(): UIMaterialTextViewApplyMask {
    return React.useCallback((text: string): UIMaterialTextViewInputState => {
        return {
            formattedText: text,
            carretPosition: null,
        };
    }, []);
}

export function useApplyMask(
    mask: UIMaterialTextViewMask | undefined,
    selectionEnd: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
): UIMaterialTextViewApplyMask {
    /**
     * The prop `mask` must not be changed, so we can use ref to make sure it will not.
     * NOTE: Do not reassign this ref!
     */
    const maskRef = React.useRef(mask);

    React.useEffect(() => {
        if (maskRef.current !== mask) {
            console.error(`[UIMaterialTextView] useApplyMask.ts: prop 'mask' must not be changed`);
        }
    }, [mask]);

    /**
     * Since we agreed that `maskRef` will no be reassigned,
     * then the same hooks will be executed after each render.
     */
    switch (maskRef.current) {
        case 'AmountInteger':
        case 'AmountPrecision':
        case 'AmountCurrency':
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useApplyMaskAmount(maskRef.current, selectionEnd, skipNextOnSelectionChange);
        default:
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useApplyMaskDefault();
    }
}
