import * as React from 'react';
import type { TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { useFocused, useUITextViewValue } from './UITextView';
import {
    UIMaterialTextView,
    UIMaterialTextViewProps,
    UIMaterialTextViewRef,
} from './UIMaterialTextView';

const MAX_KEY_LENGTH = 64;

type OnDone = (key: string) => void | Promise<void>;

export function useKeyTextView(
    ref: React.Ref<TextInput> | null,
    isFocused: boolean,
    props: UIMaterialTextViewProps & {
        onDone: OnDone;
    },
) {
    const {
        inputValue,
        inputHasValue,
        onChangeText: onChangeTextBase,
        onKeyPress: onKeyPressBase,
    } = useUITextViewValue(ref, true, props);
    const { onDone } = props;

    const [hasInvalidChars, setHasInvalidChars] = React.useState(false);
    const [hasProperLength, setHasProperLength] = React.useState(false);

    const onChangeText = React.useCallback(
        (t: string) => {
            const text = onChangeTextBase(t);

            const isProperLength = text.length === MAX_KEY_LENGTH;

            if (hasProperLength !== isProperLength) {
                setHasProperLength(isProperLength);
            }

            const isCharsInvalid = /[^0-9a-fA-F]/gi.test(text);

            if (hasInvalidChars !== isCharsInvalid) {
                setHasInvalidChars(isCharsInvalid);
            }
        },
        [hasInvalidChars, hasProperLength, onChangeTextBase],
    );

    const onKeyPress = React.useCallback(
        (e: any) => {
            const wasClearedWithEnter = onKeyPressBase(e);

            if (wasClearedWithEnter) {
                onDone(inputValue.current);
            }
        },
        [onDone, onKeyPressBase, inputValue],
    );

    const { helperText, error, success } = React.useMemo(() => {
        if (hasInvalidChars) {
            return {
                helperText: uiLocalized.KeyTextView.InvalidChars,
                error: true,
                success: false,
            };
        }

        if (!isFocused && inputHasValue && !hasProperLength) {
            return {
                helperText: uiLocalized.KeyTextView.InproperLength,
                error: true,
                success: false,
            };
        }

        if (!hasInvalidChars && hasProperLength) {
            return {
                helperText: uiLocalized.KeyTextView.Valid,
                error: false,
                success: true,
            };
        }

        return {
            error: false,
            success: false,
        };
    }, [inputHasValue, hasInvalidChars, hasProperLength, isFocused]);

    return {
        helperText,
        error,
        success,
        onChangeText,
        onKeyPress,
    };
}

type UIKeyTextViewProps = Omit<UIMaterialTextViewProps, keyof ReturnType<typeof useKeyTextView>> & {
    onDone: OnDone;
};

export const UIKeyTextView = React.forwardRef<UIMaterialTextViewRef, UIKeyTextViewProps>(
    function UIKeyTextViewForwarded(props: UIKeyTextViewProps, ref) {
        const { isFocused, onFocus, onBlur } = useFocused(props.onFocus, props.onBlur);
        const { onChangeText, onKeyPress, helperText, success, error } = useKeyTextView(
            ref,
            isFocused,
            props,
        );

        return (
            <UIMaterialTextView
                ref={ref}
                {...props}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                helperText={helperText}
                success={success}
                error={error}
            />
        );
    },
);
