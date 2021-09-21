import * as React from 'react';
import { ImageSourcePropType, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Button, UILayout } from './Button';
import type { ButtonAnimations } from './Button/types';

import { UIConstant } from './constants';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UILabelColors, UILabelRoles } from './UILabel';

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
     * Auxiliary text displayed under the main title
     */
    caption?: string;
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
};

const getButtonStates = (type: UILinkButtonType) => {
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

    const iconAnimStyle = useAnimatedStyle(() => {
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
    };
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
    caption,
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
    const { title: titleAnim, icon: iconAnim } = buttonAnimations;

    if (title != null && caption != null) {
        return (
            <Button
                containerStyle={[layout, styles.flexBasis]}
                contentStyle={[styles.content, styles.doubleLineContent]}
                animations={buttonAnimations}
                disabled={disabled}
                loading={loading}
                onLongPress={onLongPress}
                onPress={onPress}
                testID={testID}
            >
                <Button.Content direction={Button.ContentDirection.Column}>
                    <Button.Title titleColor={contentColor} titleAnimStyle={titleAnim?.style}>
                        {title}
                    </Button.Title>
                    <Button.Title
                        titleColor={UILabelColors.TextSecondary}
                        titleRole={UILabelRoles.ParagraphNote}
                        numberOfLines={5}
                        style={styles.caption}
                    >
                        {caption}
                    </Button.Title>
                </Button.Content>
            </Button>
        );
    }

    return (
        <Button
            containerStyle={[containerHeight, layout]}
            contentStyle={styles.content}
            animations={buttonAnimations}
            disabled={disabled}
            loading={loading}
            onLongPress={onLongPress}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {iconPosition === UILinkButtonIconPosition.Left && icon != null && (
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        iconAnimStyle={iconAnim?.style}
                        initialColor={iconAnim?.initialColor}
                        activeColor={iconAnim?.activeColor}
                    />
                )}
                {title != null && (
                    <Button.Title titleColor={contentColor} titleAnimStyle={titleAnim?.style}>
                        {title}
                    </Button.Title>
                )}
                {iconPosition === UILinkButtonIconPosition.Middle && icon != null && (
                    <Button.Icon
                        source={icon}
                        iconAnimStyle={iconAnim?.style}
                        initialColor={iconAnim?.initialColor}
                        activeColor={iconAnim?.activeColor}
                    />
                )}
            </Button.Content>
            {iconPosition === UILinkButtonIconPosition.Right && icon != null && (
                <Button.Icon
                    source={icon}
                    iconAnimStyle={iconAnim?.style}
                    initialColor={iconAnim?.initialColor}
                    activeColor={iconAnim?.activeColor}
                />
            )}
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
    caption: {
        marginTop: UIConstant.tinyContentOffset,
    },
    normalContainer: {
        height: UIConstant.linkButtonHeight,
    },
    smallContainer: {
        height: UIConstant.linkButtonHeight / 2,
    },
    doubleLineContent: {
        paddingVertical: UIConstant.normalContentOffset,
    },
    flexBasis: {
        ...Platform.select({
            web: {
                flexBasis: 'auto',
            },
            default: {
                flexBasis: 1,
            },
        }),
    },
});
