import * as React from 'react';
import { ColorValue, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';

export function UIWideBoxButtonPrimary({ title, icon }: UIWideBoxButtonProps) {
    const contentColor = usePressableContentColor(contentColors.primary);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: contentColor.value as ColorValue,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <UILabel color={ColorVariants.StaticTextPrimaryLight} role={UILabelRoles.Action}>
                {title}
            </UILabel>
            {icon ? (
                <UIImage
                    source={icon}
                    style={styles.image}
                    tintColor={ColorVariants.StaticTextPrimaryLight}
                />
            ) : null}
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
