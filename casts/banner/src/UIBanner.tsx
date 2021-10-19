import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.themes';

type Props = {
    text: string;
    backgroundColor?: ColorVariants;
    textColor?: ColorVariants;
    style?: StyleProp<ViewStyle>; // TODO: Make the style strict as it's done for UILabelStyle
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: UILayoutConstant.alertBorderRadius,
    },
});

export function UIBanner(props: Props) {
    const { text, backgroundColor, textColor, style } = props;

    return (
        <UIBackgroundView
            color={backgroundColor || UIBackgroundViewColors.BackgroundNegative}
            style={[style, styles.container]}
        >
            <UILabel
                role={UILabelRoles.ActionCallout}
                color={textColor || UILabelColors.TextPrimaryInverted}
            >
                {text}
            </UILabel>
        </UIBackgroundView>
    );
}
