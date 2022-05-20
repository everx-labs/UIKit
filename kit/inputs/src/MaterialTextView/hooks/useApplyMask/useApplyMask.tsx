import * as React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type {
    MaterialTextViewMask,
    MaterialTextViewApplyMask,
    MaterialTextViewInputState,
} from '../../types';
import { useApplyMaskAmount } from './amount';

function useApplyMaskDefault(): MaterialTextViewApplyMask {
    return React.useCallback((text: string): MaterialTextViewInputState => {
        'worklet';

        return {
            formattedText: text,
            carretPosition: null,
        };
    }, []);
}

export function useApplyMask(
    mask: MaterialTextViewMask | undefined,
    selectionEnd: SharedValue<number>,
    skipNextOnSelectionChange: SharedValue<boolean>,
): MaterialTextViewApplyMask {
    /**
     * The prop `mask` must not be changed, so we can use ref to make sure it will not.
     * NOTE: Do not reassign this ref!
     */
    const maskRef = React.useRef(mask);

    React.useEffect(() => {
        if (maskRef.current !== mask) {
            console.error(`[MaterialTextView] useApplyMask.ts: prop 'mask' must not be changed`);
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
