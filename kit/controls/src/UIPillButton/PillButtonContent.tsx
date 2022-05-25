import * as React from 'react';
import { ColorValue, LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UIConstant } from '../constants';
import {
    UIPillButtonVariant,
    UIPillButtonIconPosition,
    ContentColors,
    BackgroundOverlayColors,
} from './constants';
import type { UIPillButtonProps } from './types';
import { usePressableContentColor } from '../Pressable';
import { UIIndicator } from '../UIIndicator';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const PillButtonContent = ({
    icon,
    iconPosition = UIPillButtonIconPosition.Left,
    loading,
    title,
    variant = UIPillButtonVariant.Neutral,
}: UIPillButtonProps) => {
    const backgroundColor = usePressableContentColor(ContentColors[variant].background);
    const contentColor = usePressableContentColor(ContentColors[variant].content);
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
        return {
            backgroundColor: backgroundOverlayColor.value,
        };
    });

    /**
     * To animate button shape transition between loading and regular state on mobile platform.
     */
    React.useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [loading]);

    const image = React.useMemo(() => {
        if (icon == null) {
            return null;
        }
        return (
            <UIAnimatedImage source={icon} style={styles.icon} animatedProps={animatedImageProps} />
        );
    }, [animatedImageProps, icon]);

    const iconPositionRelatedContainerStyle = React.useMemo(() => {
        if (iconPosition === UIPillButtonIconPosition.Left && icon) {
            return styles.leftIconContent;
        }
        if (iconPosition === UIPillButtonIconPosition.Right && icon) {
            return styles.rightIconContent;
        }
        return null;
    }, [icon, iconPosition]);

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundOverlayStyle]} />
            {loading ? (
                <UIIndicator color={ColorVariants.TextPrimary} size={UIConstant.loaderSize} />
            ) : (
                <View style={[styles.content, iconPositionRelatedContainerStyle]}>
                    {iconPosition === UIPillButtonIconPosition.Left ? image : null}
                    {title ? (
                        <UILabelAnimated
                            role={UILabelRoles.ActionCallout}
                            animatedProps={animatedLabelProps}
                            selectable={false}
                            style={styles.title}
                        >
                            {title}
                        </UILabelAnimated>
                    ) : null}
                    {iconPosition === UIPillButtonIconPosition.Right ? image : null}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: UIConstant.pillButtonHeight,
        minWidth: UIConstant.pillButtonHeight,
        borderRadius: UIConstant.pillButtonBorderRadius,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        maxWidth: '100%',
        paddingVertical: UIConstant.tinyContentOffset,
        paddingHorizontal: UIConstant.normalContentOffset,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftIconContent: {
        paddingLeft: UIConstant.tinyContentOffset,
    },
    rightIconContent: {
        paddingRight: UIConstant.tinyContentOffset,
    },
    title: {
        paddingVertical: UIConstant.tinyContentOffset / 2,
    },
    icon: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
    },
});
