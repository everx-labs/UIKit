import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { UIConstant } from './constants';
import { UIBackgroundView, UIBackgroundViewColors } from './UIBackgroundView';
import { UILabel, UILabelColors, UILabelRoles } from './UILabel';

import type { ColorVariants } from '@tonlabs/uikit.themes';

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
        borderRadius: UIConstant.alertBorderRadius,
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
