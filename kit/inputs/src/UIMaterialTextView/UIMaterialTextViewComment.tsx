import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UITextViewProps } from '../UITextView';

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
        onLayout?: Pick<UITextViewProps, 'onLayout'>;
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children, success, warning, error } = props;

    const commentColor = useCommentColor(success, warning, error);

    return (
        <View style={styles.container} onLayout={onLayout}>
            {children}
            {helperText ? (
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={commentColor}
                    style={styles.comment}
                    numberOfLines={1}
                >
                    {helperText}
                </UILabel>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingBottom: 20,
    },
    comment: {
        position: 'absolute',
        bottom: 0,
        left: UILayoutConstant.contentOffset,
    },
});
