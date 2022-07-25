/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _injectInputValue, _uiKitInputController */
export function injectInputValue(
    animatedRef: React.RefObject<UITextViewRef>,
    inputManagerRef: React.RefObject<InputBinder | undefined>,
    value: string,
    caretPosition: number,
) {
    'worklet';

    if (!_WORKLET) {
        console.error(
            `[InputValueInjector]: [injectInputValue]: The function used in JS thread. Please use this function only on reanimated UI thread.`,
        );
        return;
    }

    // @ts-expect-error
    if (typeof animatedRef !== 'function' || typeof animatedRef() !== 'number') {
        console.error(
            `[InputValueInjector]: [injectInputValue]: First argument is not a reanimated ref. Please provide it.`,
        );
        return;
    }

    // @ts-expect-error
    const viewTag: number = animatedRef();

    if (!inputManagerRef.current) {
        const inputManager = _uiKitInputController?.bind(viewTag);
        // @ts-expect-error
        // eslint-disable-next-line no-param-reassign
        inputManagerRef.current = inputManager;
        inputManager?.setText(value, caretPosition);
    } else {
        inputManagerRef.current.setText(value, caretPosition);
    }
}
