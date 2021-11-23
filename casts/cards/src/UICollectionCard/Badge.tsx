import * as React from 'react';
import { View } from 'react-native';
import {
    UILabel,
    TypographyVariants,
    ColorVariants,
    makeStyles,
    Theme,
    useTheme,
} from '@tonlabs/uikit.themes';

import type { BadgeProps } from './types';
import { UIConstant } from '../constants';

export const Badge: React.FC<BadgeProps> = ({ badge }: BadgeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    if (!badge) {
        return null;
    }
    if (typeof badge === 'number') {
        return (
            <View style={styles.numberBadge}>
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={ColorVariants.StaticTextPrimaryLight}
                >
                    {badge}
                </UILabel>
            </View>
        );
    }
    return <View style={styles.imageBadge}>{badge}</View>;
};

const useStyles = makeStyles((theme: Theme) => ({
    numberBadge: {
        borderRadius: UIConstant.uiCollectionCard.badge.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        alignSelf: 'flex-end',
        paddingHorizontal: UIConstant.uiCollectionCard.badge.paddingHorizontal,
        paddingVertical: UIConstant.uiCollectionCard.badge.paddingVertical,
        minWidth: UIConstant.uiCollectionCard.badge.borderRadius * 2,
    },
    imageBadge: {
        borderRadius: UIConstant.uiCollectionCard.badge.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        alignSelf: 'flex-end',
    },
}));
