import * as React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

// eslint-disable-next-line no-shadow
export enum UILinkButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
}

// eslint-disable-next-line no-shadow
export enum UILinkButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

// eslint-disable-next-line no-shadow
export enum UILinkButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export type UILinkButtonProps = {
    disabled?: boolean;
    icon?: ImageSourcePropType;
    iconPosition?: UILinkButtonIconPosition;
    layout?: UILayout;
    onPress?: () => void | Promise<void>;
    testID?: string;
    title: string;
    type?: UILinkButtonType;
    variant?: UILinkButtonVariant;
}

const getButtonStates = (
    type: UILinkButtonType,
) => {
    if (type === UILinkButtonType.Primary) {
        return {
            activeContentColor: ColorVariants.TextAccent,
        };
    }
    return {
        activeContentColor: ColorVariants.TextPrimary,
    };
};

function useButtonAnimations(
    type: UILinkButtonType,
    contentColor: ColorVariants,
) {
    const { activeContentColor } = getButtonStates(type);
    const theme = useTheme();

    const titleAnim = Animated.useSharedValue(0);
    const titleAnimStyle = Animated.useAnimatedStyle(() => {
        return {
            color: Animated.interpolateColor(
                titleAnim.value,
                [0, 1],
                [
                    theme[ColorVariants[contentColor]] as string,
                    theme[ColorVariants[activeContentColor]] as string,
                ],
            ),
        };
    });
    const iconAnimStyle = Animated.useAnimatedStyle(() => {
        return {
            tintColor: Animated.interpolateColor(
                titleAnim.value,
                [0, 1],
                [
                    theme[ColorVariants[contentColor]] as string,
                    theme[ColorVariants[activeContentColor]] as string,
                ],
            ),
        };
    });

    return {
        animatedHover: {
            hoverAnim: titleAnim,
            hoverBackgroundStyle: null,
            hoverOverlayStyle: null,
        },
        animatedPress: {
            pressAnim: titleAnim,
            pressBackgroundStyle: null,
            pressOverlayStyle: null,
        },
        animatedTitle: {
            titleAnim,
            titleAnimStyle,
        },
        animatedIcon: {
            iconAnim: titleAnim,
            iconAnimStyle,
        },
    }
}

function useButtonStyles(
    type: UILinkButtonType,
    variant: UILinkButtonVariant,
    disabled?: boolean,
) {
    let contentColor: ColorVariants = ColorVariants.TextAccent;

    if (disabled) {
        contentColor = ColorVariants.TextOverlay;
    } else if (variant === UILinkButtonVariant.Negative) {
        contentColor = ColorVariants.TextNegative;
    } else if (variant === UILinkButtonVariant.Positive) {
        contentColor = ColorVariants.TextPositive;
    } else if (type === UILinkButtonType.Primary) {
        contentColor = ColorVariants.TextPrimary;
    } else {
        contentColor = ColorVariants.TextAccent;
    }

    return { contentColor };
}

export const UILinkButton = ({
    disabled,
    icon,
    iconPosition = UILinkButtonIconPosition.Middle,
    layout,
    onPress,
    testID,
    title,
    type = UILinkButtonType.Primary,
    variant = UILinkButtonVariant.Neutral,
}: UILinkButtonProps) => {
    const { contentColor } = useButtonStyles(type, variant, disabled);
    const buttonAnimations = useButtonAnimations(type, contentColor);

    return (
        <Button
            containerStyle={[
                styles.container,
                layout,
            ]}
            animations={buttonAnimations}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UILinkButtonIconPosition.Left && icon &&
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        iconAnimStyle={buttonAnimations.animatedIcon.iconAnimStyle}
                    />
                }
                <Button.Title
                    titleColor={ColorVariants.TextAccent}
                    titleAnimStyle={buttonAnimations.animatedTitle.titleAnimStyle}
                >
                    {title}
                </Button.Title>
                {
                    iconPosition === UILinkButtonIconPosition.Middle && icon &&
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.animatedIcon.iconAnimStyle}
                    />
                }
            </Button.Content>
            {
                iconPosition === UILinkButtonIconPosition.Right && icon &&
                <Button.Icon
                    source={icon}
                    iconAnimStyle={buttonAnimations.animatedIcon.iconAnimStyle}
                />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.linkButtonHeight,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
