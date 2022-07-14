/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _moveInputCaret */
export function moveInputCaret(
    animatedRef: React.RefObject<UITextViewRef>,
    _carretPosition: number,
) {
    'worklet';

    if (!_WORKLET) {
        console.error(
            `[InputValueInjector]: [moveInputCaret]: The function used in JS thread. Please use this function only on reanimated UI thread.`,
        );
        return;
    }

    // @ts-expect-error
    if (typeof animatedRef !== 'function' || typeof animatedRef() !== 'number') {
        console.error(
            `[InputValueInjector]: [moveInputCaret]: First argument is not a reanimated ref. Please provide it.`,
        );
        return;
    }

    // @ts-expect-error
    const viewTag: number = animatedRef();

    // _moveInputCaret(viewTag, carretPosition);
}
