import * as React from 'react';

export function useInputHasValue(
    value: string | undefined,
    defaultValue: string | undefined,
    onChangeTextProp: ((text: string) => void) | undefined,
) {
    // Little optimization to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(
        (value != null && value !== '') || (defaultValue != null && defaultValue !== ''),
    );

    React.useEffect(() => {
        if (value == null) {
            return;
        }

        const hasValue = value.length > 0;
        if (hasValue !== inputHasValue) {
            setInputHasValue(hasValue);
        }
    }, [value, inputHasValue]);

    const onChangeText = React.useCallback(
        // Sometimes when we trying to change a value with
        // a ref's method `changeValue`, we don't want to call onChangeText prop,
        // since the call might be already from an onChangeText prop
        // and it could cause a recursive calls
        (text: string, callOnChange = true) => {
            const hasValue = text != null ? text.length > 0 : false;

            if (hasValue !== inputHasValue) {
                setInputHasValue(hasValue);
            }

            if (callOnChange && onChangeTextProp) {
                onChangeTextProp(text);
            }

            return text;
        },
        [inputHasValue, onChangeTextProp],
    );

    return {
        inputHasValue,
        onChangeText,
    };
}
