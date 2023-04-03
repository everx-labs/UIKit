import React from 'react';
import { InputChildrenColorScheme } from '../../InputChildren';
import { UIMaterialTextViewColorScheme } from '../types';

export function useInputChildrenColorScheme(colorScheme?: UIMaterialTextViewColorScheme) {
    return React.useMemo<InputChildrenColorScheme>(() => {
        switch (colorScheme) {
            case UIMaterialTextViewColorScheme.Secondary:
                return InputChildrenColorScheme.Secondary;
            case UIMaterialTextViewColorScheme.Default:
            default:
                return InputChildrenColorScheme.Default;
        }
    }, [colorScheme]);
}
