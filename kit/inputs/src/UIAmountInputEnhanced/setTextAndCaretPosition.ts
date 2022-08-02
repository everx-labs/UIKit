/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _uiKitInputBinder */
export function setTextAndCaretPosition(
    animatedRef: React.RefObject<UITextViewRef>,
    inputManagerRef: React.RefObject<InputController | undefined>,
    value: string,
    caretPosition: number,
) {
    'worklet';

    if (!_WORKLET) {
        console.error(
            `[InputValueInjector]: [setTextAndCaretPosition]: The function used in JS thread. Please use this function only on reanimated UI thread.`,
        );
        return;
    }

    // @ts-expect-error
    if (typeof animatedRef !== 'function' || typeof animatedRef() !== 'number') {
        console.error(
            `[InputValueInjector]: [setTextAndCaretPosition]: First argument is not a reanimated ref. Please provide it.`,
        );
        return;
    }

    // @ts-expect-error
    const viewTag: number = animatedRef();

    if (!inputManagerRef.current) {
        const inputController = _uiKitInputBinder?.bind(viewTag);
        // @ts-expect-error
        // eslint-disable-next-line no-param-reassign
        inputManagerRef.current = inputController;
        inputController?.setTextAndCaretPosition(value, caretPosition);
    } else {
        inputManagerRef.current.setTextAndCaretPosition(value, caretPosition);
    }
}
