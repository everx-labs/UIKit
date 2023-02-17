import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { InputMessageProps, InputMessageType } from './types';
import { InputMessageContainer } from './InputMessageContainer';

export function InputMessage({ children, type, onPress }: InputMessageProps) {
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

    if (!children) {
        return <View style={styles.bottomDefaultOffset} />;
    }

    return (
        <InputMessageContainer onPress={onPress} style={styles.container}>
            <UILabel
                role={TypographyVariants.ParagraphLabel}
                color={commentColor}
                style={styles.comment}
            >
                {children}
            </UILabel>
        </InputMessageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    comment: {
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    bottomDefaultOffset: {
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        height: StyleSheet.flatten(Typography[TypographyVariants.ParagraphLabel]).lineHeight,
    },
});
