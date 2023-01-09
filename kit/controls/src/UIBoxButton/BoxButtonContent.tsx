import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant } from '../constants';
import {
    UIBoxButtonType,
    UIBoxButtonVariant,
    UIBoxButtonIconPosition,
    ContentColors,
    BackgroundOverlayColors,
} from './constants';
import type { UIBoxButtonProps } from './types';
import { usePressableContentColor } from '../Pressable';
import { UIIndicator } from '../UIIndicator';

export const BoxButtonContent = ({
    icon,
    iconPosition = UIBoxButtonIconPosition.Left,
    loading,
    title,
    type = UIBoxButtonType.Primary,
    variant = UIBoxButtonVariant.Neutral,
}: UIBoxButtonProps) => {
    const backgroundColor = usePressableContentColor(ContentColors[type][variant].background);
    const contentColor = usePressableContentColor(ContentColors[type][variant].content);
    const backgroundOverlayColor = usePressableContentColor(BackgroundOverlayColors);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor.value,
        };
    });

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

    const animatedBackgroundOverlayStyle = useAnimatedStyle(() => {
        if (type === UIBoxButtonType.Primary) {
            return {
                backgroundColor: backgroundOverlayColor.value,
            };
        }
        return {};
    }, [type]);

    const imageStyle = React.useMemo(() => {
        switch (iconPosition) {
            case UIBoxButtonIconPosition.Left:
                return styles.leftIcon;
            case UIBoxButtonIconPosition.Right:
                return styles.rightIcon;
            default:
                return null;
        }
    }, [iconPosition]);

    const image = React.useMemo(() => {
        if (icon == null) {
            return null;
        }
        return (
            <UIAnimatedImage
                source={icon}
                style={[styles.icon, imageStyle]}
                animatedProps={animatedImageProps}
            />
        );
    }, [animatedImageProps, icon, imageStyle]);

    const isRightIconPosition = iconPosition === UIBoxButtonIconPosition.Right;

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundOverlayStyle]} />
            {loading ? (
                <UIIndicator
                    style={styles.indicator}
                    color={ColorVariants.TextPrimary}
                    size={UIConstant.loaderSize}
                />
            ) : (
                <View style={[styles.content, isRightIconPosition ? styles.extraPadding : null]}>
                    <View style={styles.centerContent}>
                        {iconPosition === UIBoxButtonIconPosition.Left ? image : null}
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
                        {iconPosition === UIBoxButtonIconPosition.Middle ? image : null}
                    </View>
                    {isRightIconPosition ? image : null}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.boxButtonHeight,
        borderRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: UILayoutConstant.normalContentOffset,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    /**
     * Needed in order to leave space for icon in `UIBoxButtonIconPosition.Right` position
     */
    extraPadding: {
        paddingHorizontal: UILayoutConstant.normalContentOffset + UILayoutConstant.iconSize,
    },
    centerContent: {
        flexDirection: 'row',
    },
    indicator: {
        margin: UILayoutConstant.normalContentOffset,
    },
    icon: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    leftIcon: {
        marginRight: UILayoutConstant.smallContentOffset,
    },
    rightIcon: {
        position: 'absolute',
        right: UILayoutConstant.normalContentOffset,
        top: UILayoutConstant.contentInsetVerticalX3,
    },
});
