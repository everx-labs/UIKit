import * as React from 'react';

import { InputMessageColorScheme } from '../../InputMessage';
import { UIAmountInputColorScheme } from '../types';

export function useInputMessageColorScheme(
    colorScheme: UIAmountInputColorScheme,
): InputMessageColorScheme {
    return React.useMemo(() => {
        switch (colorScheme) {
            case UIAmountInputColorScheme.Secondary:
                return InputMessageColorScheme.Secondary;
            case UIAmountInputColorScheme.Default:
            default:
                return InputMessageColorScheme.Default;
        }
    }, [colorScheme]);
}
