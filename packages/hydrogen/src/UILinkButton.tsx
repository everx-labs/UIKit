import * as React from 'react';
import { ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button, ButtonAnimations, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

// eslint-disable-next-line no-shadow
export enum UILinkButtonType {
    Link = 'Link',
    Menu = 'Menu',
}

// eslint-disable-next-line no-shadow
export enum UILinkButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

// eslint-disable-next-line no-shadow
export enum UILinkButtonSize {
    Small = 'Small',
    Normal = 'Normal',
}

// eslint-disable-next-line no-shadow
export enum UILinkButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export type UILinkButtonProps = {
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
     * - `UILinkButtonIconPosition.Left` - icon to the left near the title
     * - `UILinkButtonIconPosition.Middle` - icon to the right near the title
     * - `UILinkButtonIconPosition.Right` - icon at the end of the button
     */
    iconPosition?: UILinkButtonIconPosition;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UILayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press longer than 500 milliseconds
     */
    onLongPress?: () => void | Promise<void>;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * Size property for button height regulation
     * - `UILinkButtonSize.Small` - button with height 24
     * - `UILinkButtonSize.Normal` - button with height 48 (default)
     */
    size?: UILinkButtonSize;
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
     * - `UILinkButtonType.Link` - button with current theme accent title color (default)
     * - `UILinkButtonType.Menu` - button with current theme primary title color
     */
    type?: UILinkButtonType;
    /**
     * Variant of the button; specific type allows to display the corresponding button action nature
     * - `UILinkButtonVariant.Neutral` - button with regular action (default)
     * - `UILinkButtonVariant.Negative` - button associated with some destructive action
     * - `UILinkButtonVariant.Positive` - button associated with some affirmative action
     */
    variant?: UILinkButtonVariant;
}

const getButtonStates = (
    type: UILinkButtonType,
) => {
    if (type === UILinkButtonType.Menu) {
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
): ButtonAnimations {
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
    size: UILinkButtonSize,
    type: UILinkButtonType,
    variant: UILinkButtonVariant,
    disabled?: boolean,
) {
    let contentColor: ColorVariants;
    let containerHeight: StyleProp<ViewStyle>;

    if (size === UILinkButtonSize.Small) {
        containerHeight = styles.smallContainer;
    } else {
        containerHeight = styles.normalContainer;
    }

    if (disabled) {
        contentColor = ColorVariants.TextOverlay;
    } else if (variant === UILinkButtonVariant.Negative) {
        contentColor = ColorVariants.TextNegative;
    } else if (variant === UILinkButtonVariant.Positive) {
        contentColor = ColorVariants.TextPositive;
    } else if (type === UILinkButtonType.Menu) {
        contentColor = ColorVariants.TextPrimary;
    } else {
        contentColor = ColorVariants.TextAccent;
    }

    return { contentColor, containerHeight };
}

export const UILinkButton = ({
    disabled,
    icon,
    iconPosition = UILinkButtonIconPosition.Middle,
    layout,
    loading,
    onLongPress,
    onPress,
    size = UILinkButtonSize.Normal,
    testID,
    title,
    type = UILinkButtonType.Link,
    variant = UILinkButtonVariant.Neutral,
}: UILinkButtonProps) => {
    const { contentColor, containerHeight } = useButtonStyles(size, type, variant, disabled);
    const buttonAnimations = useButtonAnimations(type, contentColor);

    return (
        <Button
            containerStyle={[
                containerHeight,
                layout,
            ]}
            contentStyle={styles.content}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onLongPress={onLongPress}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UILinkButtonIconPosition.Left && icon != null &&
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                }
                {
                    title != null &&
                    <Button.Title
                        titleColor={contentColor}
                        titleAnimStyle={buttonAnimations.title?.style}
                    >
                        {title}
                    </Button.Title>
                }
                {
                    iconPosition === UILinkButtonIconPosition.Middle && icon != null &&
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={buttonAnimations.icon?.style}
                        initialColor={buttonAnimations.icon?.initialColor}
                        activeColor={buttonAnimations.icon?.activeColor}
                    />
                }
            </Button.Content>
            {
                iconPosition === UILinkButtonIconPosition.Right && icon != null &&
                <Button.Icon
                    source={icon}
                    iconAnimStyle={buttonAnimations.icon?.style}
                    initialColor={buttonAnimations.icon?.initialColor}
                    activeColor={buttonAnimations.icon?.activeColor}
                />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    content: {
        alignItems: 'flex-start',
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
    normalContainer: {
        height: UIConstant.linkButtonHeight,
    },
    smallContainer: {
        height: UIConstant.linkButtonHeight / 2,
    },
});
