import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

export enum InputMessageType {
    Error = 'Error',
    Warning = 'Warning',
    Success = 'Success',
    Info = 'Info',
}
type InputMessageProps = {
    text: string | undefined;
    type: InputMessageType | undefined;
    children: React.ReactNode;
};

export function InputMessage({ text, type = InputMessageType.Info, children }: InputMessageProps) {
    const commentColor = React.useMemo(() => {
        switch (type) {
            case InputMessageType.Error:
                return ColorVariants.TextNegative;
            case InputMessageType.Warning:
                return ColorVariants.TextPrimary;
            case InputMessageType.Success:
                return ColorVariants.TextPositive;
            case InputMessageType.Info:
            default:
                return ColorVariants.TextTertiary;
        }
    }, [type]);

    return (
        <>
            {children}
            {text ? (
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={commentColor}
                    style={styles.comment}
                >
                    {text}
                </UILabel>
            ) : (
                <View style={styles.bottomDefaultOffset} />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    comment: {
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    bottomDefaultOffset: {
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        height: StyleSheet.flatten(Typography[TypographyVariants.ParagraphLabel]).lineHeight,
    },
});
