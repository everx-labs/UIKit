import * as React from 'react';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { StyleSheet } from 'react-native';

export function Caption({ title }: { title: string | undefined }) {
    if (!title) {
        return null;
    }
    return (
        <UILabel
            role={UILabelRoles.NarrowParagraphFootnote}
            color={UILabelColors.TextSecondary}
            style={styles.label}
        >
            {title}
        </UILabel>
    );
}

const styles = StyleSheet.create({
    label: {
        paddingLeft: UILayoutConstant.contentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
    },
});
