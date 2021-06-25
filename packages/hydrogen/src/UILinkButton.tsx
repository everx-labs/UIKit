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
    title?: string;
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
            opacity: titleAnim.value,
        };
    });

    return {
        title: {
            animationParam: titleAnim,
            style: titleAnimStyle,
        },
        icon: {
            animationParam: titleAnim,
            style: iconAnimStyle,
            initialColor: contentColor,
            activeColor: activeContentColor,
        },
    }
}

function useButtonStyles(
    type: UILinkButtonType,
    variant: UILinkButtonVariant,
    disabled?: boolean,
) {
    let contentColor: ColorVariants;

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
            contentStyle={styles.content}
            animations={buttonAnimations}
            disabled={disabled}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UILinkButtonIconPosition.Left && icon &&
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        iconAnimStyle={buttonAnimations.icon.style}
                        initialColor={buttonAnimations.icon.initialColor}
                        activeColor={buttonAnimations.icon.activeColor}
                    />
                }
                {
                    title &&
                    <Button.Title
                        titleColor={contentColor}
                        titleAnimStyle={buttonAnimations.title.style}
                    >
                        {title}
                    </Button.Title>
                }
                {
                    iconPosition === UILinkButtonIconPosition.Middle && icon &&
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.icon.style}
                        initialColor={buttonAnimations.icon.initialColor}
                        activeColor={buttonAnimations.icon.activeColor}
                    />
                }
            </Button.Content>
            {
                iconPosition === UILinkButtonIconPosition.Right && icon &&
                <Button.Icon
                    source={icon}
                    iconAnimStyle={buttonAnimations.icon.style}
                    initialColor={buttonAnimations.icon.initialColor}
                    activeColor={buttonAnimations.icon.activeColor}
                />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.linkButtonHeight,
    },
    content: {
        alignItems: 'flex-start',
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
