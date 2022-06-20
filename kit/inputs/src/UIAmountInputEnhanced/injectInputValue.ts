import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _injectInputValue */
export function injectInputValue(animatedRef: React.RefObject<UITextViewRef>, value: string) {
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

    _injectInputValue(viewTag, value);
}
