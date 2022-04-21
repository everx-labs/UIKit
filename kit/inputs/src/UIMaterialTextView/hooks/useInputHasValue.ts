import * as React from 'react';
import { LayoutAnimation, Platform } from 'react-native';

export function useInputHasValue(value: string | undefined, defaultValue: string | undefined) {
    // Little optimization to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(!!value || !!defaultValue);

    React.useEffect(() => {
        if (value == null) {
            return;
        }

        const hasValue = value.length > 0;
        if (hasValue !== inputHasValue) {
            setInputHasValue(hasValue);
        }
    }, [value, inputHasValue]);

    const checkInputHasValue = React.useCallback(
        (text: string) => {
            const hasValue = text != null ? text.length > 0 : false;

            if (hasValue !== inputHasValue) {
                setInputHasValue(hasValue);
            }

            return text;
        },
        [inputHasValue],
    );

    React.useEffect(() => {
        if (Platform.OS === 'ios') {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    }, [inputHasValue]);

    return {
        inputHasValue,
        checkInputHasValue,
    };
}
