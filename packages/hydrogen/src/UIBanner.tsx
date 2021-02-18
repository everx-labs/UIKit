import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { UIBackgroundView, UIBackgroundViewColors } from './UIBackgroundView';
import { UILabel, UILabelColors, UILabelRoles } from './UILabel';

import type { ColorVariants } from './Colors';

type Props = {
    text?: string,
    backgroundColor?: ColorVariants,
    textColor?: ColorVariants,
    style?: StyleProp<ViewStyle>,
};

export function UIBanner(props: Props) {
    const {
        text,
        backgroundColor,
        textColor,
        style,
    } = props;

    if (!text) {
        return null;
    }

    return (
        <UIBackgroundView
            color={backgroundColor || UIBackgroundViewColors.BackgroundNegative}
            style={style}
        >
            <UILabel
                role={UILabelRoles.ActionCallout}
                color={textColor || UILabelColors.TextPrimaryInverted}
            >
                {text || ''}
            </UILabel>
        </UIBackgroundView>
    );
};
