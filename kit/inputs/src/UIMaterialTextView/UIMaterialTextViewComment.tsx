import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import type { UITextViewProps } from '../UITextView';

import type { UIMaterialTextViewProps } from './types';

const getCommentColor = (
    success: boolean | undefined,
    error: boolean | undefined,
): ColorVariants => {
    if (success) {
        return ColorVariants.TextPositive;
    }
    if (error) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextSecondary;
};

export function UIMaterialTextViewComment(
    props: UIMaterialTextViewProps & {
        onLayout?: Pick<UITextViewProps, 'onLayout'>;
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children, success, error } = props;

    if (!helperText) {
        return (
            <View style={styles.withoutCommentContainer} onLayout={onLayout}>
                {children}
            </View>
        );
    }

    return (
        <View style={styles.withCommentContainer} onLayout={onLayout}>
            {children}
            <UILabel
                role={TypographyVariants.ParagraphNote}
                color={getCommentColor(success, error)}
                style={styles.comment}
            >
                {helperText}
            </UILabel>
        </View>
    );
}

const styles = StyleSheet.create({
    withoutCommentContainer: {
        paddingTop: 12,
        paddingBottom: 18,
    },
    withCommentContainer: {
        flexDirection: 'column',
        paddingTop: 12,
        paddingBottom: 12,
    },
    comment: {
        marginTop: 10,
    },
});
