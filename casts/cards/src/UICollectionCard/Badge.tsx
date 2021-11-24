import * as React from 'react';
import { ImageStyle, View } from 'react-native';
import {
    UILabel,
    TypographyVariants,
    ColorVariants,
    makeStyles,
    Theme,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';

import type { BadgeProps } from './types';
import { UIConstant } from '../constants';

export const Badge: React.FC<BadgeProps> = ({ badge }: BadgeProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    if (!badge) {
        return null;
    }
    if (typeof badge === 'string') {
        return (
            <View style={styles.stringBadge}>
                <UILabel
                    role={TypographyVariants.ParagraphLabel}
                    color={ColorVariants.StaticTextPrimaryLight}
                >
                    {badge}
                </UILabel>
            </View>
        );
    }
    return (
        <View style={styles.imageBadge}>
            <UIImage source={badge} style={styles.image as ImageStyle} />
        </View>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    stringBadge: {
        borderRadius: UIConstant.uiCollectionCard.badge.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        alignSelf: 'flex-end',
        paddingHorizontal: UIConstant.uiCollectionCard.badge.paddingHorizontal,
        paddingVertical: UIConstant.uiCollectionCard.badge.paddingVertical,
        minWidth: UIConstant.uiCollectionCard.badge.borderRadius * 2,
    },
    imageBadge: {
        borderRadius: UILayoutConstant.iconSize / 2,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
        alignSelf: 'flex-end',
    },
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
}));
