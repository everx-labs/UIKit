import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

import { UILabelRoles, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import { ContentColors, UIButtonGroupActionIconPosition, UILayoutConstants } from './constants';
import { UIConstant } from '../constants';
import type { UIButtonGroupActionProps } from './types';
import { usePressableContentColor } from '../Pressable';

function AnimatedImage({
    icon,
    contentColor,
}: {
    icon: UIButtonGroupActionProps['icon'];
    contentColor: Readonly<Animated.SharedValue<string | number>>;
}) {
    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    if (icon == null) {
        return null;
    }
    return <UIAnimatedImage source={icon} style={styles.icon} animatedProps={animatedImageProps} />;
}

function Content({
    icon,
    iconPosition = UIButtonGroupActionIconPosition.Left,
    children,
}: UIButtonGroupActionProps) {
    const contentColor = usePressableContentColor(ContentColors.content);

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
                        role={UILabelRoles.ActionFootnote}
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
    const { loading } = props;
    const backgroundColor = usePressableContentColor(ContentColors.background);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {loading ? <UISkeleton style={styles.skeleton} show /> : <Content {...props} />}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        flex: 1,
        height: UIConstant.iconSize,
        borderRadius: UILayoutConstants.skeletonBorderRadius,
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
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
    },
});
