import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';
import { UILabelRoles } from './UILabel';

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
}

const getButtonStates = (
    type: UIMsgButtonType,
) => {
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
    buttonStyle: StyleProp<ViewStyle>,
    backgroundColor: ColorVariants,
    borderColor: ColorVariants,
    contentColor: ColorVariants,
) {
    const {
        hoverBackgroundColor,
        hoverBorderColor,
        pressBackgroundColor,
        pressBorderColor,
        activeContentColor,
    } = getButtonStates(type);
    const theme = useTheme();

    const hoverAnim = Animated.useSharedValue(0);
    const hoverStyle = Animated.useAnimatedStyle(() => {
        let initialBackgroundColor;
        let initialBorderColor;

        if (type === UIMsgButtonType.Primary) {
            initialBackgroundColor = theme[ColorVariants.Transparent] as string;
            initialBorderColor = theme[ColorVariants.Transparent] as string;
        } else {
            initialBackgroundColor = theme[ColorVariants[backgroundColor]] as string;
            initialBorderColor = theme[ColorVariants[borderColor]] as string;
        }

        const hoverStyleValues = {
            backgroundColor: Animated.interpolateColor(
                hoverAnim.value,
                [0, 1],
                [
                    initialBackgroundColor,
                    theme[ColorVariants[hoverBackgroundColor]] as string,
                ],
            ),
            borderColor: Animated.interpolateColor(
                hoverAnim.value,
                [0, 1],
                [
                    initialBorderColor,
                    theme[ColorVariants[hoverBorderColor]] as string,
                ],
            ),
        };

        if (type === UIMsgButtonType.Primary) {
            return hoverStyleValues;
        }
        return StyleSheet.flatten([
            buttonStyle,
            hoverStyleValues,
        ]);
    });

    const pressAnim = Animated.useSharedValue(0);
    const pressStyle = Animated.useAnimatedStyle(() => {
        const pressStyleValues = {
            backgroundColor: Animated.interpolateColor(
                pressAnim.value,
                [0, 1],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants[pressBackgroundColor]] as string,
                ],
            ),
            borderColor: Animated.interpolateColor(
                pressAnim.value,
                [0, 1],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants[pressBorderColor]] as string,
                ],
            ),
        };
        if (type === UIMsgButtonType.Primary) {
            return pressStyleValues;
        }
        return StyleSheet.flatten([
            buttonStyle,
            pressStyleValues,
        ]);
    });

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

    const iconAnim = Animated.useSharedValue(0);
    const iconAnimStyle = Animated.useAnimatedStyle(() => {
        return {
            tintColor: Animated.interpolateColor(
                iconAnim.value,
                [0, 1],
                [
                    theme[ColorVariants[contentColor]] as string,
                    theme[ColorVariants[activeContentColor]] as string,
                ],
            ),
        };
    });

    if (type === UIMsgButtonType.Primary) {
        return {
            animatedHover: {
                hoverAnim,
                hoverBackgroundStyle: null,
                hoverOverlayStyle: hoverStyle,
            },
            animatedPress: {
                pressAnim,
                hoverBackgroundStyle: null,
                pressOverlayStyle: pressStyle,
            },
            animatedTitle: {
                titleAnim,
                titleAnimStyle,
            },
            animatedIcon: {
                iconAnim,
                iconAnimStyle,
            },
        }
    }
    return {
        animatedHover: {
            hoverAnim,
            hoverBackgroundStyle: hoverStyle,
            hoverOverlayStyle: null,
        },
        animatedPress: {
            pressAnim,
            pressBackgroundStyle: pressStyle,
            pressOverlayStyle: null,
        },
        animatedTitle: {
            titleAnim,
            titleAnimStyle,
        },
        animatedIcon: {
            iconAnim,
            iconAnimStyle,
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
    variant = UIMsgButtonVariant.Neutral
}: UIMsgButtonProps) => {
    const { buttonStyle, backgroundColor, borderColor, contentColor } = useButtonStyles(type, variant, cornerPosition, disabled, loading);
    const buttonAnimations = useButtonAnimations(type, buttonStyle, backgroundColor, borderColor, contentColor);
    const [ content, containerStyle, contentStyle ] = React.useMemo(() => {
        const { animatedTitle: { titleAnimStyle }, animatedIcon: { iconAnimStyle }} = buttonAnimations;
        if (title && caption) {
            return [
                (
                    <Button.Content direction={Button.ContentDirection.Column}>
                        <Button.Title
                            titleColor={contentColor}
                            titleAnimStyle={titleAnimStyle}
                        >
                            {title}
                        </Button.Title>
                        <Button.Title
                            titleColor={contentColor}
                            titleRole={UILabelRoles.ActionLabel}
                            titleAnimStyle={titleAnimStyle}
                        >
                            {caption}
                        </Button.Title>
                    </Button.Content>
                ),
                null,
                styles.doubleLineContent,
            ];
        }

        return [
            (
                <>
                    <Button.Content>
                        {
                            iconPosition === UIMsgButtonIconPosition.Left && icon &&
                            <Button.Icon
                                source={icon}
                                style={styles.leftIcon}
                                iconAnimStyle={iconAnimStyle}
                            />
                        }
                        {
                            title &&
                            <Button.Title
                                titleColor={contentColor}
                                titleAnimStyle={titleAnimStyle}
                            >
                                {title}
                            </Button.Title>
                        }
                        {
                            iconPosition === UIMsgButtonIconPosition.Middle && icon &&
                            <Button.Icon
                                source={icon}
                                iconAnimStyle={iconAnimStyle}
                            />
                        }
                    </Button.Content>
                    {
                        iconPosition === UIMsgButtonIconPosition.Right && icon &&
                        <Button.Icon
                            source={icon}
                            iconAnimStyle={iconAnimStyle}
                        />
                    }
                </>
            ),
            styles.singleLineContainer,
            styles.singleLineContent,
        ];
    }, [caption, icon, iconPosition, title, contentColor, buttonAnimations]);

    return (
        <Button
            containerStyle={[
                containerStyle,
                buttonStyle,
                layout,
            ]}
            contentStyle={contentStyle}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            {content}
        </Button>
    )
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
