import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleSheet } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { ColorVariants, useTheme, UILabelRoles } from '@tonlabs/uikit.themes';
import { Button } from './Button';
import type { ButtonAnimations } from './Button/types';
import { UIConstant } from './constants';
import type { UILayout } from './types';

// eslint-disable-next-line no-shadow
export enum UIPillButtonIconPosition {
    Left = 'Left',
    Right = 'Right',
}

// eslint-disable-next-line no-shadow
export enum UIPillButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export type UIPillButtonProps = {
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
     * - `UIPillButtonIconPosition.Left` - icon to the left near the title
     * - `UIPillButtonIconPosition.Right` - icon to the right near the title
     */
    iconPosition?: UIPillButtonIconPosition;
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
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIPillButtonVariant.Neutral` - button with regular action (default)
     * - `UIPillButtonVariant.Negative` - button associated with some destructive action
     * - `UIPillButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIPillButtonVariant;
};

const buttonStates = {
    hoverOverlayColor: ColorVariants.StaticHoverOverlay,
    pressOverlayColor: ColorVariants.StaticPressOverlay,
    activeContentColor: ColorVariants.StaticTextPrimaryLight,
};

function useButtonAnimations(contentColor: ColorVariants): ButtonAnimations {
    const { hoverOverlayColor, pressOverlayColor, activeContentColor } = buttonStates;
    const theme = useTheme();

    const hoverAnim = useSharedValue(0);
    const hoverOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                hoverAnim.value,
                [0, 1],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants[hoverOverlayColor]] as string,
                ],
            ),
        };
    });

    const pressAnim = useSharedValue(0);
    const pressOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressAnim.value,
                [0, 1],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants[pressOverlayColor]] as string,
                ],
            ),
        };
    });

    const titleAnim = useSharedValue(0);
    const titleAnimStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                titleAnim.value,
                [0, 1],
                [
                    theme[ColorVariants[contentColor]] as string,
                    theme[ColorVariants[activeContentColor]] as string,
                ],
            ),
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

function useButtonStyles(variant: UIPillButtonVariant, disabled?: boolean, loading?: boolean) {
    let backgroundColor: ColorVariants = ColorVariants.BackgroundAccent;
    let contentColor: ColorVariants = ColorVariants.StaticTextPrimaryLight;

    if (loading) {
        backgroundColor = ColorVariants.BackgroundNeutral;
    } else if (variant === UIPillButtonVariant.Negative) {
        backgroundColor = ColorVariants.BackgroundNegative;
    } else if (variant === UIPillButtonVariant.Positive) {
        backgroundColor = ColorVariants.BackgroundPositive;
    }
    if (disabled) {
        contentColor = ColorVariants.TextOverlayInverted;
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderRadius: UIConstant.pillButtonBorderRadius,
    };

    return {
        buttonStyle,
        contentColor,
    };
}

export const UIPillButton = ({
    disabled,
    icon,
    iconPosition = UIPillButtonIconPosition.Left,
    layout,
    loading,
    onPress,
    testID,
    title,
    variant = UIPillButtonVariant.Neutral,
}: UIPillButtonProps) => {
    const { buttonStyle, contentColor } = useButtonStyles(variant, disabled, loading);
    const buttonAnimations = useButtonAnimations(contentColor);
    const contentStyle = React.useMemo(() => {
        if (icon != null && !title) {
            return [styles.leftIconOffset, styles.rightIconOffset];
        }
        if (icon != null && iconPosition === UIPillButtonIconPosition.Left) {
            return [styles.leftIconOffset, styles.rightTitleOffset];
        }
        if (icon != null && iconPosition === UIPillButtonIconPosition.Right) {
            return [styles.leftTitleOffset, styles.rightIconOffset];
        }
        return [styles.leftTitleOffset, styles.rightTitleOffset];
    }, [icon, iconPosition, title]);

    return (
        <Button
            containerStyle={[styles.container, buttonStyle, layout]}
            contentStyle={contentStyle}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {iconPosition === UIPillButtonIconPosition.Left && icon != null && (
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                )}
                {title != null && (
                    <Button.Title
                        titleColor={contentColor}
                        titleRole={UILabelRoles.ActionCallout}
                        titleAnimStyle={buttonAnimations.title?.style}
                    >
                        {title}
                    </Button.Title>
                )}
                {iconPosition === UIPillButtonIconPosition.Right && icon != null && (
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                )}
            </Button.Content>
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.pillButtonHeight,
    },
    leftIconOffset: {
        paddingLeft: UIConstant.tinyContentOffset,
    },
    rightIconOffset: {
        paddingRight: UIConstant.tinyContentOffset,
    },
    leftTitleOffset: {
        paddingLeft: UIConstant.normalContentOffset,
    },
    rightTitleOffset: {
        paddingRight: UIConstant.normalContentOffset,
    },
});
