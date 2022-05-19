import * as React from 'react';
import type { TextInputProps } from 'react-native';

export function useFocused(
    onFocusProp: TextInputProps['onFocus'],
    onBlurProp: TextInputProps['onBlur'],
) {
    const [isFocused, setIsFocused] = React.useState(false);
    const onFocus = React.useCallback(
        e => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(e);
            }
        },
        [onFocusProp, setIsFocused],
    );
    const onBlur = React.useCallback(
        e => {
            setIsFocused(false);

            if (onBlurProp) {
                onBlurProp(e);
            }
        },
        [onBlurProp, setIsFocused],
    );

    return {
        isFocused,
        onFocus,
        onBlur,
    };
}
