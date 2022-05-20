import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

import {
    ColorVariants,
    UILabelColors,
    UILabelRoles,
    UILabelAnimated,
    UILabel,
} from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import {
    ContentColors,
    UILinkButtonIconPosition,
    UILinkButtonSize,
    UILinkButtonType,
    UILinkButtonVariant,
} from './constants';
import { UIConstant } from '../constants';
import type { UILinkButtonProps } from './types';
import { usePressableContentColor } from '../Pressable';
import { UIIndicator } from '../UIIndicator';

export function UILinkButtonContent({
    caption,
    icon,
    iconPosition = UILinkButtonIconPosition.Middle,
    loading,
    size = UILinkButtonSize.Normal,
    title,
    type = UILinkButtonType.Link,
    variant = UILinkButtonVariant.Neutral,
}: UILinkButtonProps) {
    const contentColor = usePressableContentColor(ContentColors[type][variant].content);

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
            iconPosition === UILinkButtonIconPosition.Left ? styles.leftIcon : null;
        return (
            <UIAnimatedImage
                source={icon}
                style={[styles.icon, additionalStyle]}
                animatedProps={animatedImageProps}
            />
        );
    }, [animatedImageProps, icon, iconPosition]);

    const isRightIconPosition = iconPosition === UILinkButtonIconPosition.Right;

    const indicatorColor = React.useMemo(() => {
        switch (type) {
            case UILinkButtonType.Link:
                return ColorVariants.TextAccent;
            case UILinkButtonType.Menu:
            default:
                return ColorVariants.TextPrimary;
        }
    }, [type]);

    const containerHeightStyle = React.useMemo(() => {
        switch (size) {
            case UILinkButtonSize.Normal:
                return styles.normalContainerHeight;
            case UILinkButtonSize.Small:
            default:
                return styles.smallContainerHeight;
        }
    }, [size]);

    return (
        <Animated.View style={[styles.container, containerHeightStyle]}>
            {loading ? (
                <UIIndicator
                    style={styles.indicator}
                    color={indicatorColor}
                    size={UIConstant.loaderSize}
                />
            ) : (
                <View style={[styles.content, isRightIconPosition ? styles.extraPadding : null]}>
                    <View style={styles.mainContent}>
                        {iconPosition === UILinkButtonIconPosition.Left ? image : null}
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
                                {iconPosition === UILinkButtonIconPosition.Middle ? image : null}
                            </View>
                            {caption ? (
                                <UILabel
                                    color={UILabelColors.TextSecondary}
                                    role={UILabelRoles.ParagraphNote}
                                    numberOfLines={5}
                                    ellipsizeMode="tail"
                                    style={styles.caption}
                                >
                                    {caption}
                                </UILabel>
                            ) : null}
                        </View>
                    </View>
                    {isRightIconPosition ? (
                        <View style={styles.rightIconContainer}>{image}</View>
                    ) : null}
                </View>
            )}
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
        padding: UIConstant.normalContentOffset,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    /**
     * Needed in order to leave space for icon in `UILinkButtonIconPosition.Right` position
     */
    extraPadding: {
        paddingRight: UIConstant.normalContentOffset + UIConstant.iconSize,
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
        paddingRight: UIConstant.normalContentOffset,
    },
    caption: {
        marginTop: UIConstant.tinyContentOffset,
    },
});
