import * as React from 'react';
import { ColorValue, ImageStyle, StyleSheet } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';
import { UIIndicator } from '../../UIIndicator';

function RightContent({
    icon,
    loading,
    contentColor,
}: Pick<UIWideBoxButtonProps, 'icon' | 'loading'> & {
    contentColor: Readonly<Animated.SharedValue<string | number>>;
}) {
    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

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
                animatedProps={animatedImageProps}
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
            backgroundColor: backgroundColor.value as ColorValue,
        };
    });
    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
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
    },
    image: {
        marginLeft: UILayoutConstant.normalContentOffset,
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
