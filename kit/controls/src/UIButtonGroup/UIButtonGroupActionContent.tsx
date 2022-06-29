import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

import { UILabelRoles, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { ContentColors, UIButtonGroupActionIconPosition } from './constants';
import { UIConstant } from '../constants';
import type { UIButtonGroupActionProps } from './types';
import { usePressableContentColor } from '../Pressable';

export function UIButtonGroupActionContent({
    icon,
    iconPosition = UIButtonGroupActionIconPosition.Left,
    children,
}: UIButtonGroupActionProps) {
    const contentColor = usePressableContentColor(ContentColors.content);
    const backgroundColor = usePressableContentColor(ContentColors.background);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value,
        };
    });

    const image = React.useMemo(() => {
        if (icon == null) {
            return null;
        }
        return (
            <UIAnimatedImage
                source={icon}
                style={[styles.icon]}
                animatedProps={animatedImageProps}
            />
        );
    }, [animatedImageProps, icon]);

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {iconPosition === UIButtonGroupActionIconPosition.Left ? image : null}
            <View style={styles.textContainer}>
                {children ? (
                    <UILabelAnimated
                        role={UILabelRoles.Action}
                        animatedProps={animatedLabelProps}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        selectable={false}
                    >
                        {children}
                    </UILabelAnimated>
                ) : null}
            </View>
            {iconPosition === UIButtonGroupActionIconPosition.Right ? image : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexShrink: 0,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    textContainer: {
        flexDirection: 'row',
    },
    icon: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
    },
});
