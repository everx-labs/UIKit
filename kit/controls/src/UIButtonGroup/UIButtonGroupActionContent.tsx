import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

import { UILabelRoles, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { ContentColors, UIButtonGroupActionIconPosition } from './constants';
import { UIConstant } from '../constants';
import type { UIButtonGroupActionProps } from './types';
import { usePressableContentColor } from '../Pressable';

export function UIButtonGroupActionContent({
    icon,
    iconPosition = UIButtonGroupActionIconPosition.Left,
    title,
}: UIButtonGroupActionProps) {
    const contentColor = usePressableContentColor(ContentColors);

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

    const image = React.useMemo(() => {
        if (icon == null) {
            return null;
        }
        const additionalStyle =
            iconPosition === UIButtonGroupActionIconPosition.Left ? styles.leftIcon : null;
        return (
            <UIAnimatedImage
                source={icon}
                style={[styles.icon, additionalStyle]}
                animatedProps={animatedImageProps}
            />
        );
    }, [animatedImageProps, icon, iconPosition]);

    const isRightIconPosition = iconPosition === UIButtonGroupActionIconPosition.Right;

    return (
        <Animated.View style={[styles.container]}>
            <View style={[styles.content, isRightIconPosition ? styles.extraPadding : null]}>
                <View style={styles.mainContent}>
                    {iconPosition === UIButtonGroupActionIconPosition.Left ? image : null}
                    <View>
                        <View style={styles.actionContainer}>
                            {title ? (
                                <UILabelAnimated
                                    role={UILabelRoles.Action}
                                    animatedProps={animatedLabelProps}
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    selectable={false}
                                >
                                    {title}
                                </UILabelAnimated>
                            ) : null}
                        </View>
                    </View>
                </View>
                {isRightIconPosition ? (
                    <View style={styles.rightIconContainer}>{image}</View>
                ) : null}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    normalContainerHeight: {
        minHeight: UIConstant.linkButtonHeight,
    },
    smallContainerHeight: {
        minHeight: UIConstant.linkButtonHeight / 2,
    },
    content: {
        paddingVertical: UIConstant.normalContentOffset,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    /**
     * Needed in order to leave space for icon in `UIButtonGroupActionIconPosition.Right` position
     */
    extraPadding: {
        paddingRight: UIConstant.iconSize,
    },
    mainContent: {
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
    },
    indicator: {
        margin: UIConstant.normalContentOffset,
    },
    icon: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
    rightIconContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    caption: {
        marginTop: UIConstant.tinyContentOffset,
    },
});
