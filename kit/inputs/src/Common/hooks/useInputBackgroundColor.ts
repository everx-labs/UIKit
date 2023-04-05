import * as React from 'react';
import { useTheme } from '@tonlabs/uikit.themes';
import { InputColorScheme, inputBackgroundColorsScheme } from '../constants';

export function useInputBackgroundColor(colorScheme: InputColorScheme, editable: boolean) {
    const theme = useTheme();
    return React.useMemo(() => {
        const backgroundColorVariant =
            inputBackgroundColorsScheme[colorScheme][editable ? 'regular' : 'disabled'];
        return theme[backgroundColorVariant];
    }, [colorScheme, editable, theme]);
}
