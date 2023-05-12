import * as React from 'react';
import { Platform, StyleSheet, ImageStyle } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableAnimatedImageTintColorProps, usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';
import { UIIndicator } from '../../UIIndicator';

function RightContent({
    icon,
    loading,
    contentColor,
}: Pick<UIWideBoxButtonProps, 'icon' | 'loading'> & {
    contentColor: Readonly<Animated.SharedValue<string>>;
}) {
    const animatedImageProps = usePressableAnimatedImageTintColorProps(contentColor);

    if (loading) {
        return (
            <UIIndicator
                color={ColorVariants.TextOverlayInverted}
                size={UILayoutConstant.iconSize}
            />
        );
    }
    if (icon) {
        return (
            <UIAnimatedImage
                source={icon}
                style={styles.image as ImageStyle}
                {...animatedImageProps}
            />
        );
    }
    return null;
}

export function UIWideBoxButtonPrimary({ title, icon, loading }: UIWideBoxButtonProps) {
    const backgroundColor = usePressableContentColor(contentColors.primaryBackground);
    const contentColor = usePressableContentColor(contentColors.primaryContent);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value,
        };
    });
    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <UILabelAnimated role={UILabelRoles.Action} animatedProps={animatedLabelProps}>
                {title}
            </UILabelAnimated>
            <RightContent icon={icon} loading={loading} contentColor={contentColor} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.contentOffset,
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
});
