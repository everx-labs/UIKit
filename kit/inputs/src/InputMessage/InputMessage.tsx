import * as React from 'react';
import { StyleSheet } from 'react-native';

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

    return (
        <InputMessageContainer onPress={onPress} style={styles.container} message={children}>
            {children && children.length > 0 ? (
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={commentColor}
                    style={styles.comment}
                >
                    {children}
                </UILabel>
            ) : null}
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
