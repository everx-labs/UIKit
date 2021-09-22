import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleSheet } from 'react-native';
import {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

import { Button, UILayout } from './Button';
import type { ButtonAnimations } from './Button/types';

import { UIConstant } from './constants';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

// eslint-disable-next-line no-shadow
export enum UIBoxButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Tertiary = 'Tertiary',
    Nulled = 'Nulled',
}

// eslint-disable-next-line no-shadow
export enum UIBoxButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

// eslint-disable-next-line no-shadow
export enum UIBoxButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export type UIBoxButtonProps = {
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Position of icon on the button
     * - `UIBoxButtonIconPosition.Left` - icon to the left near the title
     * - `UIBoxButtonIconPosition.Middle` - icon to the right near the title
     * - `UIBoxButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UIBoxButtonIconPosition;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UILayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Text displayed on the button
     */
    title?: string;
    /**
     * Type of the button; specific type allows to set the corresponding accent
     * - `UIBoxButtonType.Primary` - button with current theme accent background color (default)
     * - `UIBoxButtonType.Secondary` - button with current theme primary inverted background color
     * - `UIBoxButtonType.Tertiary` - button with 1 px border style
     * - `UIBoxButtonType.Nulled` - button without visible borders and background color
     */
    type?: UIBoxButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIBoxButtonVariant.Neutral` - button with regular action (default)
     * - `UIBoxButtonVariant.Negative` - button associated with some destructive action
     * - `UIBoxButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIBoxButtonVariant;
};

const getButtonStates = (type: UIBoxButtonType) => {
    if (type === UIBoxButtonType.Primary) {
        return {
            hoverOverlayColor: ColorVariants.StaticHoverOverlay,
            pressOverlayColor: ColorVariants.StaticPressOverlay,
            activeContentColor: ColorVariants.StaticTextPrimaryLight,
        };
    } else if (type === UIBoxButtonType.Secondary) {
        return {
            hoverOverlayColor: ColorVariants.BackgroundTertiary,
            pressOverlayColor: ColorVariants.BackgroundNeutral,
            activeContentColor: ColorVariants.TextPrimary,
        };
    } else if (type === UIBoxButtonType.Tertiary) {
        return {
            hoverOverlayColor: ColorVariants.Transparent,
            pressOverlayColor: ColorVariants.Transparent,
            activeContentColor: ColorVariants.TextPrimary,
        };
    }
    return {
        hoverOverlayColor: ColorVariants.Transparent,
        pressOverlayColor: ColorVariants.Transparent,
        activeContentColor: ColorVariants.TextAccent,
    };
};

function useButtonAnimations(type: UIBoxButtonType, contentColor: ColorVariants): ButtonAnimations {
    const { hoverOverlayColor, pressOverlayColor, activeContentColor } = getButtonStates(type);
    const theme = useTheme();

    const hoverAnim = useSharedValue(0);
    const hoverOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            hoverAnim.value,
            [0, 1],
            [
                theme[ColorVariants.Transparent] as string,
                theme[ColorVariants[hoverOverlayColor]] as string,
            ],
        );
    });
    const hoverOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: hoverOverlayValue.value,
        };
    });

    const pressAnim = useSharedValue(0);
    const pressOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            pressAnim.value,
            [0, 1],
            [
                theme[ColorVariants.Transparent] as string,
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });
    const pressOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: pressOverlayValue.value,
        };
    });

    const titleAnim = useSharedValue(0);
    const titleAnimValue = useDerivedValue(() => {
        return interpolateColor(
            titleAnim.value,
            [0, 1],
            [
                theme[ColorVariants[contentColor]] as string,
                theme[ColorVariants[activeContentColor]] as string,
            ],
        );
    });
    const titleAnimStyle = useAnimatedStyle(() => {
        return {
            color: titleAnimValue.value,
        };
    });

    const iconAnim = useSharedValue(0);
    const iconAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: iconAnim.value,
        };
    });

    return {
        hover: {
            animationParam: hoverAnim,
            backgroundStyle: undefined,
            overlayStyle: hoverOverlayStyle,
        },
        press: {
            animationParam: pressAnim,
            backgroundStyle: undefined,
            overlayStyle: pressOverlayStyle,
        },
        title: {
            animationParam: titleAnim,
            style: titleAnimStyle,
        },
        icon: {
            animationParam: iconAnim,
            style: iconAnimStyle,
            initialColor: contentColor,
            activeColor: activeContentColor,
        },
    };
}

function useButtonStyles(
    type: UIBoxButtonType,
    variant: UIBoxButtonVariant,
    disabled?: boolean,
    loading?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let contentColor: ColorVariants = ColorVariants.TextAccent;

    if (type === UIBoxButtonType.Primary) {
        // primary background color
        if (loading) {
            backgroundColor = ColorVariants.BackgroundNeutral;
        } else if (variant === UIBoxButtonVariant.Negative) {
            backgroundColor = ColorVariants.BackgroundNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            backgroundColor = ColorVariants.BackgroundPositive;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
        }
        // primary content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextOverlayInverted;
        } else {
            contentColor = ColorVariants.StaticTextPrimaryLight;
        }
    } else if (type === UIBoxButtonType.Secondary) {
        // secondary background color
        if (loading) {
            backgroundColor = ColorVariants.BackgroundNeutral;
        } else {
            backgroundColor = ColorVariants.BackgroundSecondary;
        }
        // secondary content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            contentColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            contentColor = ColorVariants.TextPositive;
        } else {
            contentColor = ColorVariants.TextPrimary;
        }
    } else if (type === UIBoxButtonType.Tertiary) {
        // tertiary content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            contentColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            contentColor = ColorVariants.TextPositive;
        } else {
            contentColor = ColorVariants.TextAccent;
        }
    } else if (type === UIBoxButtonType.Nulled) {
        // nulled content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            contentColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            contentColor = ColorVariants.TextPositive;
        } else {
            contentColor = ColorVariants.TextPrimary;
        }
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderRadius: UIConstant.alertBorderRadius,
    };

    return {
        buttonStyle,
        contentColor,
    };
}

export const UIBoxButton = ({
    disabled,
    icon,
    iconPosition = UIBoxButtonIconPosition.Left,
    layout,
    loading,
    onPress,
    testID,
    title,
    type = UIBoxButtonType.Primary,
    variant = UIBoxButtonVariant.Neutral,
}: UIBoxButtonProps) => {
    const { buttonStyle, contentColor } = useButtonStyles(type, variant, disabled, loading);
    const buttonAnimations = useButtonAnimations(type, contentColor);

    return (
        <Button
            containerStyle={[styles.container, buttonStyle, layout]}
            contentStyle={styles.content}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {iconPosition === UIBoxButtonIconPosition.Left && icon != null && (
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                )}
                {title != null && (
                    <Button.Title
                        titleColor={contentColor}
                        titleAnimStyle={buttonAnimations.title?.style}
                    >
                        {title}
                    </Button.Title>
                )}
                {iconPosition === UIBoxButtonIconPosition.Middle && icon != null && (
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                )}
            </Button.Content>
            {iconPosition === UIBoxButtonIconPosition.Right && icon != null && (
                <Button.Icon
                    source={icon}
                    iconAnimStyle={buttonAnimations.icon?.style}
                    initialColor={buttonAnimations.icon?.initialColor}
                    activeColor={buttonAnimations.icon?.activeColor}
                />
            )}
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.boxButtonHeight,
    },
    content: {
        padding: UIConstant.normalContentOffset,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
