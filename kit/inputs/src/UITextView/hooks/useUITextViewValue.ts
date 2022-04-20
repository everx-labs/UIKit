import * as React from 'react';
import type { TextInput } from 'react-native';
import type { UITextViewProps } from '../types';

/**
 * This is useful hook if you want to listen for inputValue changes
 * But don't want to make TextInput controlled (eg. use `value` prop)
 *
 * @param useClearWithEnter boolean
 */
export function useUITextViewValue(
    ref: React.Ref<TextInput> | null,
    useClearWithEnter = false,
    {
        value: valueProp,
        defaultValue: defaultValueProp,
        onChangeText: onChangeTextProp,
    }: UITextViewProps = {},
) {
    // Little optimization to not re-render children on every value change
    const [inputHasValue, setInputHasValue] = React.useState(
        (valueProp != null && valueProp !== '') ||
            (defaultValueProp != null && defaultValueProp !== ''),
    );

    React.useEffect(() => {
        if (valueProp == null) {
            return;
        }

        const hasValue = valueProp.length > 0;
        if (hasValue !== inputHasValue) {
            setInputHasValue(hasValue);
        }
    }, [valueProp, inputHasValue]);

    // Create a ref to the current input value
    const inputValue = React.useRef(valueProp || '');
    React.useEffect(() => {
        inputValue.current = valueProp || '';
    }, [valueProp]);

    const wasClearedWithEnter = React.useRef(false);

    const onChangeText = React.useCallback(
        // Sometimes when we trying to change a value with
        // a ref's method `changeValue`, we don't want to call onChangeText prop,
        // since the call might be already from an onChangeText prop
        // and it could cause a recursive calls
        (text: string, callOnChangeProp = true) => {
            // It could be that we sent a message with "Enter" from keyboard
            // But the event with newline is fired after this
            // So, to prevent setting it, need to check a flag
            // And also check that input string is a newline
            if (useClearWithEnter && wasClearedWithEnter.current && text === '\n') {
                wasClearedWithEnter.current = false;
                return text;
            }

            inputValue.current = text;

            const hasValue = text != null ? text.length > 0 : false;

            if (hasValue !== inputHasValue) {
                setInputHasValue(hasValue);
            }

            if (callOnChangeProp && onChangeTextProp) {
                onChangeTextProp(text);
            }

            return text;
        },
        [inputHasValue, useClearWithEnter, onChangeTextProp],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            // Enable only for web (in native e.key is undefined)
            if (useClearWithEnter && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                wasClearedWithEnter.current = true;
                return true;
            }

            return false;
        },
        [useClearWithEnter],
    );

    const clear = React.useCallback(() => {
        if (ref && 'current' in ref) {
            ref.current?.clear();
        }
        inputValue.current = '';
        setInputHasValue(false);

        if (onChangeTextProp) {
            onChangeTextProp('');
        }
    }, [ref, setInputHasValue, onChangeTextProp]);

    return {
        inputHasValue,
        inputValue,
        clear,
        onChangeText,
        onKeyPress,
    };
}
