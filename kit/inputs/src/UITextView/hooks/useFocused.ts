import * as React from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native';

export function useFocused(
    onFocusProp: TextInputProps['onFocus'],
    onBlurProp: TextInputProps['onBlur'],
) {
    const [isFocused, setIsFocused] = React.useState(false);
    const onFocus = React.useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(e);
            }
        },
        [onFocusProp, setIsFocused],
    );
    const onBlur = React.useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
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
