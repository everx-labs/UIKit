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
import type { UIImageCellProps } from './types';
import { UIConstant } from '../constants';

function UIImageCellImpl({ image, title, caption, onPress, loading, testID }: UIImageCellProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    if (loading) {
        return (
            <View style={styles.container}>
                <UISkeleton show style={styles.image}>
                    <View />
                </UISkeleton>
                <View style={styles.textContainer}>
                    <UISkeleton show style={styles.textSkeleton}>
                        <View />
                    </UISkeleton>
                </View>
            </View>
        );
    }
    return (
        <TouchableOpacity testID={testID} onPress={onPress}>
            <View style={styles.container}>
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
        height: UIConstant.uiImageCell.height,
        width: UIConstant.uiImageCell.width,
        alignItems: 'center',
    },
    image: {
        width: UIConstant.uiImageCell.imageSize,
        height: UIConstant.uiImageCell.imageSize,
        borderRadius: UIConstant.uiImageCell.borderRadius,
    },
    textContainer: {
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    textSkeleton: {
        height: UIConstant.uiImageCell.textSkeleton.height,
        width: UIConstant.uiImageCell.textSkeleton.width,
        borderRadius: UIConstant.uiImageCell.textSkeleton.borderRadius,
    },
}));

export const UIImageCell = React.memo(UIImageCellImpl);
