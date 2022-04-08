import * as React from 'react';
import { ColorValue, StyleSheet } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableContentColor } from '../../Pressable';

export function UIWideBoxButtonSecondary({ title, icon }: UIWideBoxButtonProps) {
    const contentColors = React.useMemo(() => {
        return {
            initialColor: ColorVariants.BackgroundAccent,
            pressedColor: ColorVariants.SpecialAccentDark,
            hoveredColor: ColorVariants.SpecialAccentLight,
            disabledColor: ColorVariants.BackgroundNeutral,
        };
    }, []);

    const contentColor = usePressableContentColor(contentColors);

    const animatedProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value,
        };
    });

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            borderColor: contentColor.value as ColorValue,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <UILabelAnimated
                color={ColorVariants.TextPrimaryInverted}
                animatedProps={animatedLabelProps}
            >
                {title}
            </UILabelAnimated>
            <UIAnimatedImage source={icon} style={styles.image} animatedProps={animatedProps} />
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
        borderWidth: 1,
    },
    image: {
        marginLeft: UILayoutConstant.normalContentOffset,
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
