import * as React from 'react';
import { ImageStyle, Platform, StyleProp, View } from 'react-native';
import { UILabelAnimated, UILabelRoles, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableAnimatedImageTintColorProps, usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';
import { UIIndicator } from '../../UIIndicator';

function RightContent({
    icon,
    loading,
    contentColor,
    imageStyle,
}: Pick<UIWideBoxButtonProps, 'icon' | 'loading'> & {
    contentColor: Readonly<Animated.SharedValue<string>>;
    imageStyle: StyleProp<ImageStyle>;
}) {
    const animatedImageProps = usePressableAnimatedImageTintColorProps(contentColor);

    if (loading) {
        return <UIIndicator color={ColorVariants.TextOverlay} size={UILayoutConstant.iconSize} />;
    }
    if (icon) {
        return (
            <UIAnimatedImage
                source={icon}
                style={imageStyle as ImageStyle}
                {...animatedImageProps}
            />
        );
    }
    return null;
}

export function UIWideBoxButtonNulled({ title, icon, caption, loading }: UIWideBoxButtonProps) {
    const contentColor = usePressableContentColor(contentColors.nulled);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value,
        };
    });

    const styles = useStyles(!!caption);
    return (
        <View style={styles.container}>
            <UILabelAnimated role={UILabelRoles.Action} animatedProps={animatedLabelProps}>
                {title}
            </UILabelAnimated>
            <RightContent
                icon={icon}
                loading={loading}
                contentColor={contentColor}
                imageStyle={styles.image as ImageStyle}
            />
        </View>
    );
}

const useStyles = makeStyles((hasCaption: boolean) => ({
    container: {
        flexDirection: 'row',
        paddingTop: UILayoutConstant.contentInsetVerticalX4,
        paddingBottom: hasCaption ? 0 : UILayoutConstant.contentInsetVerticalX1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: UILayoutConstant.alertBorderRadius,
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: null,
        }),
    },
    image: {
        marginLeft: UILayoutConstant.normalContentOffset,
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
}));
