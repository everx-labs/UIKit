import * as React from 'react';

import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '@tonlabs/uikit.controls';

import { InputMessageType } from '../types';
import { inputMessageColors } from '../constants';
import type { InputColorScheme } from '../../constants';

export function useMessageColors(
    type: InputMessageType,
    colorScheme: InputColorScheme,
): PressableColors {
    const initialCommentColor = React.useMemo(() => {
        switch (type) {
            case InputMessageType.Error:
                return ColorVariants.TextNegative;
            case InputMessageType.Warning:
                return ColorVariants.TextPrimary;
            case InputMessageType.Success:
                return ColorVariants.TextPositive;
            case InputMessageType.Info:
            default:
                return inputMessageColors[colorScheme].initialColor;
        }
    }, [colorScheme, type]);

    return React.useMemo<PressableColors>(() => {
        return {
            ...inputMessageColors[colorScheme],
            initialColor: initialCommentColor,
        };
    }, [colorScheme, initialCommentColor]);
}
