import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { UIMaterialTextViewProps } from './types';

function useCommentColor(
    success: boolean | undefined,
    warning: boolean | undefined,
    error: boolean | undefined,
): ColorVariants {
    return React.useMemo(() => {
        if (error) {
            return ColorVariants.TextNegative;
        }
        if (warning) {
            return ColorVariants.TextPrimary;
        }
        if (success) {
            return ColorVariants.TextPositive;
        }
        return ColorVariants.TextTertiary;
    }, [success, warning, error]);
}

export function UIMaterialTextViewComment(
    props: UIMaterialTextViewProps & {
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children, success, warning, error } = props;

    const commentColor = useCommentColor(success, warning, error);

    return (
        <View onLayout={onLayout}>
            {children}
            {helperText ? (
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={commentColor}
                    style={styles.comment}
                >
                    {helperText}
                </UILabel>
            ) : (
                <View style={styles.bottomDefaultOffset} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    comment: {
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    bottomDefaultOffset: {
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        height: Typography[TypographyVariants.ParagraphLabel].lineHeight,
    },
});
