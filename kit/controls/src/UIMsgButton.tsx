import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { ColorVariants, useTheme, UILabelRoles } from '@tonlabs/uikit.themes';
import { Button } from './Button';
import type { ButtonAnimations } from './Button/types';
import { UIConstant } from './constants';
import type { UILayout } from './types';

// eslint-disable-next-line no-shadow
export enum UIMsgButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
}

// eslint-disable-next-line no-shadow
export enum UIMsgButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

// eslint-disable-next-line no-shadow
export enum UIMsgButtonCornerPosition {
    BottomLeft = 'BottomLeft',
    BottomRight = 'BottomRight',
    TopLeft = 'TopLeft',
    TopRight = 'TopRight',
}

// eslint-disable-next-line no-shadow
export enum UIMsgButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export type UIMsgButtonProps = {
    /**
     * Auxiliary text displayed on the button under the main title
     */
    caption?: string;
    /**
     * Position of non-rounded corner of the button
     * - `UIMsgButtonCornerPosition.BottomLeft` - bottom left corner has zero radius
     * - `UIMsgButtonCornerPosition.BottomRight` - bottom right corner has zero radius
     * - `UIMsgButtonCornerPosition.TopLeft` - top left corner has zero radius
     * - `UIMsgButtonCornerPosition.TopRight` - top right corner has zero radius
     */
    cornerPosition?: UIMsgButtonCornerPosition;
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
     * - `UIMsgButtonIconPosition.Left` - icon to the left near the title
     * - `UIMsgButtonIconPosition.Middle` - icon to the right near the title
     * - `UIMsgButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UIMsgButtonIconPosition;
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
     * - `UIMsgButtonType.Primary` - button with current theme accent background color (default)
     * - `UIMsgButtonType.Secondary` - button with 1 px border style and current theme accent line border color
     */
    type?: UIMsgButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UIMsgButtonVariant.Neutral` - button with regular action (default)
     * - `UIMsgButtonVariant.Negative` - button associated with some destructive action
     * - `UIMsgButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UIMsgButtonVariant;
};

const getButtonStates = (type: UIMsgButtonType) => {
    if (type === UIMsgButtonType.Primary) {
        return {
            hoverBackgroundColor: ColorVariants.StaticHoverOverlay,
            hoverBorderColor: ColorVariants.StaticHoverOverlay,
            pressBackgroundColor: ColorVariants.StaticPressOverlay,
            pressBorderColor: ColorVariants.StaticPressOverlay,
            activeContentColor: ColorVariants.StaticTextPrimaryLight,
        };
    }
    return {
        hoverBackgroundColor: ColorVariants.BackgroundPrimary,
        hoverBorderColor: ColorVariants.LineNeutral,
        pressBackgroundColor: ColorVariants.BackgroundPrimary,
        pressBorderColor: ColorVariants.LineNeutral,
        activeContentColor: ColorVariants.TextPrimary,
    };
};

function useButtonAnimations(
    type: UIMsgButtonType,
    backgroundColor: ColorVariants,
    borderColor: ColorVariants,
    contentColor: ColorVariants,
): ButtonAnimations {
    const {
        hoverBackgroundColor,
        hoverBorderColor,
        pressBackgroundColor,
        pressBorderColor,
        activeContentColor,
    } = getButtonStates(type);
    const theme = useTheme();

    let initialBackgroundColor: string;
    let initialBorderColor: string;

    if (type === UIMsgButtonType.Primary) {
        initialBackgroundColor = theme[ColorVariants.Transparent] as string;
        initialBorderColor = theme[ColorVariants.Transparent] as string;
    } else {
        initialBackgroundColor = theme[ColorVariants[backgroundColor]] as string;
        initialBorderColor = theme[ColorVariants[borderColor]] as string;
    }

    const hoverAnim = useSharedValue(0);
    const hoverStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                hoverAnim.value,
                [0, 1],
                [initialBackgroundColor, theme[ColorVariants[hoverBackgroundColor]] as string],
            ),
            borderColor: interpolateColor(
                hoverAnim.value,
                [0, 1],
                [initialBorderColor, theme[ColorVariants[hoverBorderColor]] as string],
            ),
        };
    });

    const pressAnim = useSharedValue(0);
    const pressStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressAnim.value,
                [0, 1],
                [initialBackgroundColor, theme[ColorVariants[pressBackgroundColor]] as string],
            ),
            borderColor: interpolateColor(
                pressAnim.value,
                [0, 1],
                [initialBorderColor, theme[ColorVariants[pressBorderColor]] as string],
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

    if (type === UIMsgButtonType.Primary) {
        return {
            hover: {
                animationParam: hoverAnim,
                backgroundStyle: undefined,
                overlayStyle: hoverStyle,
            },
            press: {
                animationParam: pressAnim,
                backgroundStyle: undefined,
                overlayStyle: pressStyle,
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
    return {
        hover: {
            animationParam: hoverAnim,
            backgroundStyle: hoverStyle,
            overlayStyle: undefined,
        },
        press: {
            animationParam: pressAnim,
            backgroundStyle: pressStyle,
            overlayStyle: undefined,
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
    type: UIMsgButtonType,
    variant: UIMsgButtonVariant,
    cornerPosition?: UIMsgButtonCornerPosition,
    disabled?: boolean,
    loading?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let borderColor: ColorVariants = ColorVariants.Transparent;
    let contentColor: ColorVariants = ColorVariants.TextAccent;
    let borderWidth: number = 0;
    let cornerStyle: StyleProp<ViewStyle>;

    if (type === UIMsgButtonType.Primary) {
        if (loading) {
            backgroundColor = ColorVariants.BackgroundNeutral;
        } else if (variant === UIMsgButtonVariant.Negative) {
            backgroundColor = ColorVariants.BackgroundNegative;
        } else if (variant === UIMsgButtonVariant.Positive) {
            backgroundColor = ColorVariants.BackgroundPositive;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
        }
        if (disabled) {
            contentColor = ColorVariants.TextOverlayInverted;
        } else {
            contentColor = ColorVariants.StaticTextPrimaryLight;
        }
    } else if (type === UIMsgButtonType.Secondary) {
        if (disabled || loading) {
            borderColor = ColorVariants.LineTertiary;
            contentColor = ColorVariants.TextOverlay;
        } else if (variant === UIMsgButtonVariant.Negative) {
            borderColor = ColorVariants.LineNegative;
            contentColor = ColorVariants.TextNegative;
        } else if (variant === UIMsgButtonVariant.Positive) {
            borderColor = ColorVariants.LinePositive;
            contentColor = ColorVariants.TextPositive;
        } else {
            borderColor = ColorVariants.LineAccent;
            contentColor = ColorVariants.TextAccent;
        }
        backgroundColor = ColorVariants.BackgroundPrimary;
        borderWidth = UIConstant.buttonBorderWidth;
    }

    if (cornerPosition === UIMsgButtonCornerPosition.TopLeft) {
        cornerStyle = {
            borderTopLeftRadius: 0,
        };
    } else if (cornerPosition === UIMsgButtonCornerPosition.TopRight) {
        cornerStyle = {
            borderTopRightRadius: 0,
        };
    } else if (cornerPosition === UIMsgButtonCornerPosition.BottomLeft) {
        cornerStyle = {
            borderBottomLeftRadius: 0,
        };
    } else if (cornerPosition === UIMsgButtonCornerPosition.BottomRight) {
        cornerStyle = {
            borderBottomRightRadius: 0,
        };
    }

    const theme = useTheme();

    const buttonStyle = [
        {
            backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
            borderColor: theme[ColorVariants[borderColor]] as ColorValue,
            borderRadius: UIConstant.alertBorderRadius,
            borderWidth,
        },
        cornerStyle,
    ];

    return {
        buttonStyle,
        backgroundColor,
        borderColor,
        contentColor,
    };
}

export const UIMsgButton = ({
    caption,
    cornerPosition,
    disabled,
    icon,
    iconPosition = UIMsgButtonIconPosition.Left,
    layout,
    loading,
    onPress,
    testID,
    title,
    type = UIMsgButtonType.Primary,
    variant = UIMsgButtonVariant.Neutral,
}: UIMsgButtonProps) => {
    const { buttonStyle, backgroundColor, borderColor, contentColor } = useButtonStyles(
        type,
        variant,
        cornerPosition,
        disabled,
        loading,
    );
    const buttonAnimations = useButtonAnimations(type, backgroundColor, borderColor, contentColor);
    const [content, containerStyle, contentStyle] = React.useMemo(() => {
        const { title: titleAnim, icon: iconAnim } = buttonAnimations;
        if (title && caption) {
            return [
                <Button.Content direction={Button.ContentDirection.Column}>
                    <Button.Title titleColor={contentColor} titleAnimStyle={titleAnim?.style}>
                        {title}
                    </Button.Title>
                    <Button.Title
                        titleColor={contentColor}
                        titleRole={UILabelRoles.ActionLabel}
                        titleAnimStyle={titleAnim?.style}
                    >
                        {caption}
                    </Button.Title>
                </Button.Content>,
                null,
                styles.doubleLineContent,
            ];
        }

        return [
            <>
                <Button.Content>
                    {iconPosition === UIMsgButtonIconPosition.Left && icon != null && (
                        <Button.Icon
                            source={icon}
                            style={title ? styles.leftIcon : null}
                            iconAnimStyle={iconAnim?.style}
                            initialColor={iconAnim?.initialColor}
                            activeColor={iconAnim?.activeColor}
                        />
                    )}
                    {!!title && (
                        <Button.Title titleColor={contentColor} titleAnimStyle={titleAnim?.style}>
                            {title}
                        </Button.Title>
                    )}
                    {iconPosition === UIMsgButtonIconPosition.Middle && icon != null && (
                        <Button.Icon
                            source={icon}
                            iconAnimStyle={iconAnim?.style}
                            initialColor={iconAnim?.initialColor}
                            activeColor={iconAnim?.activeColor}
                        />
                    )}
                </Button.Content>
                {iconPosition === UIMsgButtonIconPosition.Right && icon != null && (
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={iconAnim?.style}
                        initialColor={iconAnim?.initialColor}
                        activeColor={iconAnim?.activeColor}
                    />
                )}
            </>,
            styles.singleLineContainer,
            styles.singleLineContent,
        ];
    }, [caption, icon, iconPosition, title, contentColor, buttonAnimations]);

    return (
        <Button
            containerStyle={[containerStyle, buttonStyle, layout]}
            contentStyle={contentStyle}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            {content}
        </Button>
    );
};

const styles = StyleSheet.create({
    singleLineContainer: {
        height: UIConstant.msgButtonHeight,
    },
    singleLineContent: {
        paddingHorizontal: UIConstant.normalContentOffset,
    },
    doubleLineContent: {
        padding: UIConstant.smallContentOffset,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
