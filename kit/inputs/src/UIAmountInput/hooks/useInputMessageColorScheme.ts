import * as React from 'react';

import { InputMessageColorScheme } from '../../InputMessage';
import { MaterialTextViewColorScheme } from '../../MaterialTextView';

export function useInputMessageColorScheme(
    colorScheme: MaterialTextViewColorScheme,
): InputMessageColorScheme {
    return React.useMemo(() => {
        switch (colorScheme) {
            case MaterialTextViewColorScheme.Secondary:
                return InputMessageColorScheme.Secondary;
            case MaterialTextViewColorScheme.Default:
            default:
                return InputMessageColorScheme.Default;
        }
    }, [colorScheme]);
}
