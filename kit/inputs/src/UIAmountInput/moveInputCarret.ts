import type React from 'react';
import type { UITextViewRef } from '../UITextView';

/* global _WORKLET, _moveInputCarret */
export function moveInputCarret(
    animatedRef: React.RefObject<UITextViewRef>,
    carretPosition: number,
) {
    'worklet';

    if (!_WORKLET) {
        console.error(
            `[InputValueInjector]: [moveInputCarret]: The function used in JS thread. Please use this function only on reanimated UI thread.`,
        );
        return;
    }

    // @ts-expect-error
    if (typeof animatedRef !== 'function' || typeof animatedRef() !== 'number') {
        console.error(
            `[InputValueInjector]: [moveInputCarret]: First argument is not a reanimated ref. Please provide it.`,
        );
        return;
    }

    // @ts-expect-error
    const viewTag: number = animatedRef();

    _moveInputCarret(viewTag, carretPosition);
}
