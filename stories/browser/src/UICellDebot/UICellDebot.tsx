import * as React from 'react';
import { ImageStyle, StyleProp, View } from 'react-native';
import {
    ColorVariants,
    makeStyles,
    useTheme,
    UILabel,
    TypographyVariants,
} from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { UICellDebotProps } from './types';
import { UIConstant } from '../constants';

function UICellDebotImpl({ image, title, caption, onPress, loading, testID }: UICellDebotProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    if (loading) {
        return (
            <View style={styles.container}>
                <UISkeleton show style={styles.image} />
                <View style={styles.textContainer}>
                    <UISkeleton show style={styles.textSkeleton} />
                </View>
            </View>
        );
    }
    return (
        <TouchableOpacity testID={testID} onPress={onPress}>
            <View style={styles.container} testID={testID}>
                <UIImage source={image} style={styles.image as StyleProp<ImageStyle>} />
                <View style={styles.textContainer}>
                    {title ? (
                        <UILabel
                            role={TypographyVariants.NarrowActionFootnote}
                            color={ColorVariants.TextPrimary}
                            numberOfLines={caption ? 1 : 2}
                        >
                            {title}
                        </UILabel>
                    ) : null}
                    {caption ? (
                        <UILabel
                            role={TypographyVariants.NarrowParagraphFootnote}
                            color={ColorVariants.TextSecondary}
                            numberOfLines={title ? 1 : 2}
                        >
                            {caption}
                        </UILabel>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
        height: UIConstant.uiCellDebot.height,
        width: UIConstant.uiCellDebot.width,
        alignItems: 'center',
    },
    image: {
        width: UIConstant.uiCellDebot.imageSize,
        height: UIConstant.uiCellDebot.imageSize,
        borderRadius: UIConstant.uiCellDebot.borderRadius,
    },
    textContainer: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
        alignSelf: 'stretch',
        alignItems: 'center',
        textAlign: 'center',
    },
    textSkeleton: {
        height: UIConstant.uiCellDebot.textSkeleton.height,
        width: UIConstant.uiCellDebot.textSkeleton.width,
        borderRadius: UIConstant.uiCellDebot.textSkeleton.borderRadius,
    },
}));

export const UICellDebot = React.memo(UICellDebotImpl);
