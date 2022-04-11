import * as React from 'react';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { StyleSheet } from 'react-native';
import { UIWideBoxButtonType } from './constants';

export function Caption({
    title,
    wideBoxButtonType,
}: {
    title: string | undefined;
    wideBoxButtonType: UIWideBoxButtonType;
}) {
    const labelStyle = React.useMemo(() => {
        if (wideBoxButtonType === UIWideBoxButtonType.Nulled) {
            return styles.nulledLabel;
        }
        return styles.label;
    }, [wideBoxButtonType]);

    if (!title) {
        return null;
    }

    return (
        <UILabel
            role={UILabelRoles.NarrowParagraphFootnote}
            color={UILabelColors.TextSecondary}
            style={labelStyle}
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
    nulledLabel: {
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
        paddingBottom: UILayoutConstant.contentInsetVerticalX3,
    },
});
