import * as React from 'react';
import type {
    UIMaterialTextViewMask,
    ImperativeChangeText,
    MoveCarret,
} from '../UIMaterialTextView/types';
import { useApplyMaskAmount } from './amount';

function useApplyMaskDefault(imperativeChangeText: ImperativeChangeText) {
    const onSelectionChange = React.useCallback(() => null, []);

    const onChangeText = React.useCallback(
        (text: string): void => {
            /**
             * If the text is empty, then the Clear button may have been pressed,
             * if so we must call `setNativeProps` to clear the input
             */
            if (!text) {
                imperativeChangeText(text);
            } else {
                imperativeChangeText(text, {
                    shouldSetNativeProps: false,
                });
            }
        },
        [imperativeChangeText],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}

export function useApplyMask(
    imperativeChangeText: ImperativeChangeText,
    moveCarret: MoveCarret,
    mask: UIMaterialTextViewMask | undefined,
) {
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
        case 'Amount':
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useApplyMaskAmount(imperativeChangeText, moveCarret);
        default:
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useApplyMaskDefault(imperativeChangeText);
    }
}
