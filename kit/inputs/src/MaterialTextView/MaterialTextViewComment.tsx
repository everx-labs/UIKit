import * as React from 'react';
import { View } from 'react-native';

import { UILabelRoles } from '@tonlabs/uikit.themes';

import type { MaterialTextViewProps } from './types';
import { InputColorScheme, InputFont, InputMessage, InputMessageType } from '../Common';

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
        colorScheme = InputColorScheme.Default,
        font,
    } = props;

    const inputMessageType = useMessageType(success, warning, error);

    const role = React.useMemo(() => {
        switch (font) {
            case InputFont.Surf:
                return UILabelRoles.SurfParagraphSmall;
            case InputFont.Default:
            default:
                return UILabelRoles.ParagraphFootnote;
        }
    }, [font]);

    return (
        <View onLayout={onLayout}>
            {children}
            <InputMessage
                type={inputMessageType}
                onPress={onHelperTextPress}
                colorScheme={colorScheme}
                role={role}
            >
                {helperText}
            </InputMessage>
        </View>
    );
}
