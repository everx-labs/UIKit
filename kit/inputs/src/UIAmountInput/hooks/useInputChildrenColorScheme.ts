import React from 'react';
import { InputChildrenColorScheme } from '../../InputChildren';
import { UIAmountInputColorScheme } from '../types';

export function useInputChildrenColorScheme(colorScheme?: UIAmountInputColorScheme) {
    return React.useMemo<InputChildrenColorScheme>(() => {
        switch (colorScheme) {
            case UIAmountInputColorScheme.Secondary:
                return InputChildrenColorScheme.Secondary;
            case UIAmountInputColorScheme.Default:
            default:
                return InputChildrenColorScheme.Default;
        }
    }, [colorScheme]);
}
