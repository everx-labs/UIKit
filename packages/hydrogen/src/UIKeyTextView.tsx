import * as React from 'react';
import type { TextInput } from 'react-native';

import { useFocused } from './UITextView';
import {
    UIMaterialTextView,
    UIMaterialTextViewProps,
} from './UIMaterialTextView';

const MAX_KEY_LENGTH = 64;

export function useKeyTextView(isFocused: boolean) {
    const [hasValue, setHasValue] = React.useState(false);
    const [hasInvalidChars, setHasInvalidChars] = React.useState(false);
    const [hasProperLength, setHasProperLength] = React.useState(false);

    const onChangeText = React.useCallback(
        (text: string) => {
            const isNotEmpty = text.length > 0;

            if (hasValue !== isNotEmpty) {
                setHasValue(isNotEmpty);
            }

            const isProperLength = text.length === MAX_KEY_LENGTH;

            if (hasProperLength !== isProperLength) {
                setHasProperLength(isProperLength);
            }

            const isCharsInvalid = /[^0-9a-fA-F]/gi.test(text);

            if (hasInvalidChars !== isCharsInvalid) {
                setHasInvalidChars(isCharsInvalid);
            }
        },
        [hasValue, hasInvalidChars, hasProperLength],
    );

    const { helperText, error, success } = React.useMemo(() => {
        if (hasInvalidChars) {
            return {
                helperText: 'Looks like the value is not in a HEX format',
                error: true,
                success: false,
            };
        }

        if (!isFocused && hasValue && !hasProperLength) {
            return {
                helperText: 'The key should be 64 symbols long',
                error: true,
                success: false,
            };
        }

        if (!hasInvalidChars && hasProperLength) {
            return {
                error: false,
                success: true,
            };
        }

        return {
            error: false,
            success: false,
        };
    }, [hasValue, hasInvalidChars, hasProperLength, isFocused]);

    return {
        helperText,
        error,
        success,
        onChangeText,
    };
}

type UIKeyTextViewProps = Omit<
    UIMaterialTextViewProps,
    keyof ReturnType<typeof useKeyTextView>
>;

export const UIKeyTextView = React.forwardRef<TextInput, UIKeyTextViewProps>(
    function UIKeyTextViewForwarded(props: UIKeyTextViewProps, ref) {
        const { isFocused, onFocus, onBlur } = useFocused(
            props.onFocus,
            props.onBlur,
        );

        const { onChangeText, helperText, success, error } = useKeyTextView(
            isFocused,
        );

        return (
            <UIMaterialTextView
                ref={ref}
                {...props}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
                helperText={helperText}
                success={success}
                error={error}
            />
        );
    },
);
