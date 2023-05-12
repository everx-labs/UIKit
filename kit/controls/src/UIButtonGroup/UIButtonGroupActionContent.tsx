import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

import { UILabelRoles, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import {
    ContentColors,
    UIButtonGroupActionIconPosition,
    UIButtonGroupConstants,
} from './constants';
import type { UIButtonGroupActionProps } from './types';
import { usePressableAnimatedImageTintColorProps, usePressableContentColor } from '../Pressable';

function AnimatedImage({
    icon,
    contentColor,
}: {
    icon: UIButtonGroupActionProps['icon'];
    contentColor: Readonly<Animated.SharedValue<string>>;
}) {
    const animatedImageProps = usePressableAnimatedImageTintColorProps(contentColor);

    if (icon == null) {
        return null;
    }
    return <UIAnimatedImage source={icon} style={styles.icon} {...animatedImageProps} />;
}

function Content({
    icon,
    iconPosition = UIButtonGroupActionIconPosition.Left,
    children,
    contentColors,
}: UIButtonGroupActionProps) {
    const contentColor = usePressableContentColor(contentColors ?? ContentColors.content);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    return (
        <>
            {iconPosition === UIButtonGroupActionIconPosition.Left ? (
                <AnimatedImage icon={icon} contentColor={contentColor} />
            ) : null}
            <View style={styles.textContainer}>
                {children ? (
                    <UILabelAnimated
                        role={UILabelRoles.SurfActionSpecial}
                        animatedProps={animatedLabelProps}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        selectable={false}
                    >
                        {children}
                    </UILabelAnimated>
                ) : null}
            </View>
            {iconPosition === UIButtonGroupActionIconPosition.Right ? (
                <AnimatedImage icon={icon} contentColor={contentColor} />
            ) : null}
        </>
    );
}

export function UIButtonGroupActionContent(props: UIButtonGroupActionProps) {
    const { loading, backgroundColors, contentContainerStyle } = props;
    const backgroundColor = usePressableContentColor(backgroundColors ?? ContentColors.background);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedContainerStyle, contentContainerStyle]}>
            {loading ? <UISkeleton style={styles.skeleton} show /> : <Content {...props} />}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        flex: 1,
        height: UILayoutConstant.iconSize,
        borderRadius: UIButtonGroupConstants.skeletonBorderRadius,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
        paddingHorizontal: UILayoutConstant.normalContentOffset,
    },
    textContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
