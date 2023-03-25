import * as React from 'react';
import { View } from 'react-native';

import type { MaterialTextViewProps } from './types';
import { InputMessage, InputMessageType } from '../InputMessage';
import { MaterialTextViewColorScheme } from './types';
import { useInputMessageColorScheme } from './hooks';

function useMessageType(
    success: boolean | undefined,
    warning: boolean | undefined,
    error: boolean | undefined,
) {
    return React.useMemo(() => {
        if (error) {
            return InputMessageType.Error;
        }
        if (warning) {
            return InputMessageType.Warning;
        }
        if (success) {
            return InputMessageType.Success;
        }
        return InputMessageType.Info;
    }, [success, warning, error]);
}

export function MaterialTextViewComment(
    props: MaterialTextViewProps & {
        children: React.ReactNode;
    },
) {
    const {
        helperText,
        onLayout,
        children,
        success,
        warning,
        error,
        onHelperTextPress,
        colorScheme = MaterialTextViewColorScheme.Default,
    } = props;

    const inputMessageType = useMessageType(success, warning, error);

    const inputMessageColorScheme = useInputMessageColorScheme(colorScheme);

    return (
        <View onLayout={onLayout}>
            {children}
            <InputMessage
                type={inputMessageType}
                onPress={onHelperTextPress}
                colorScheme={inputMessageColorScheme}
            >
                {helperText}
            </InputMessage>
        </View>
    );
}
