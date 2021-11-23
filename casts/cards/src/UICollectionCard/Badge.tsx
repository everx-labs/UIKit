import * as React from 'react';
import { View } from 'react-native';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';

import type { BadgeProps } from './types';

export const Badge: React.FC<BadgeProps> = ({ badge, style }: BadgeProps) => {
    if (!badge) {
        return null;
    }
    return (
        <View style={style}>
            <UILabel
                role={TypographyVariants.ParagraphLabel}
                color={ColorVariants.StaticTextPrimaryLight}
            >
                {badge}
            </UILabel>
        </View>
    );
};
