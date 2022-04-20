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
            {/**
             * We need to wrap this `UILabel` into `View`
             * to make the `UILabel` animated via `LayoutAnimation`
             */}
            <View>
                <UILabel
                    style={styles.comment}
                    role={TypographyVariants.ParagraphLabel}
                    color={commentColor}
                >
                    {helperText}
                </UILabel>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    comment: {
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        paddingHorizontal: UILayoutConstant.contentOffset,
        minHeight: Typography[TypographyVariants.ParagraphLabel].lineHeight,
    },
});
