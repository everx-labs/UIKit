import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import type { UITextViewProps } from '../UITextView';

import type { UIMaterialTextViewCommonProps } from './types';

const getCommentColor = (props: UIMaterialTextViewCommonProps): ColorVariants => {
    if (props.success) {
        return ColorVariants.TextPositive;
    }
    if (props.error) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextSecondary;
};

export function UIMaterialTextViewComment(
    props: UIMaterialTextViewCommonProps & {
        onLayout?: Pick<UITextViewProps, 'onLayout'>;
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children } = props;

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
                color={getCommentColor(props)}
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
