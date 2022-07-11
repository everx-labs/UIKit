/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _injectInputValue, __uiKitInputManager */
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

    __uiKitInputManager?.injectInputValue?.(viewTag, value);
    // console.log('_injectInputValue', _injectInputValue || null);
    // console.log('_measure', _measure);
    // _injectInputValue(viewTag, value);
}
