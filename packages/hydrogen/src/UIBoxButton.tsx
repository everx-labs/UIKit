import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleSheet } from 'react-native';

import { Button, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

// eslint-disable-next-line no-shadow
export enum UIBoxButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Tertiary = 'Tertiary',
    Nulled = 'Nulled',
}

// eslint-disable-next-line no-shadow
export enum UIBoxButtonVariant {
    Default = 'Neutral',
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
     * Color of the UIBoxButtonType.Nulled button title // TODO: WTF?! Maybe we just need to set title as not required param??? And remove this one?
     */
    nulledColor?: ColorVariants;
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
    title: string;
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

// function useButtonStates(
//     type: string,
//     variant: string,
//     state: string,
// ) {
//     // TODO: add set of different states & actions
//     // hover, press, disabled, progress
// }

function useButtonStyles(
    type: string,
    variant: string,
    disabled?: boolean,
    loading?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let titleColor: ColorVariants = ColorVariants.TextAccent;

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
            titleColor = ColorVariants.TextOverlayInverted;
        } else {
            titleColor = ColorVariants.TextPrimaryInverted;
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
            titleColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            titleColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            titleColor = ColorVariants.TextPositive;
        } else {
            titleColor = ColorVariants.TextPrimary;
        }
    } else if (type === UIBoxButtonType.Tertiary) {
        // tertiary content color (title, icons)
        if (disabled) {
            titleColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            titleColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            titleColor = ColorVariants.TextPositive;
        } else {
            titleColor = ColorVariants.TextAccent;
        }
    } else if (type === UIBoxButtonType.Nulled) {
        // nulled content color (title, icons)
        if (disabled) {
            titleColor = ColorVariants.TextOverlay;
        } else if (variant === UIBoxButtonVariant.Negative) {
            titleColor = ColorVariants.TextNegative;
        } else if (variant === UIBoxButtonVariant.Positive) {
            titleColor = ColorVariants.TextPositive;
        } else {
            titleColor = ColorVariants.TextPrimary;
        }
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderRadius: UIConstant.alertBorderRadius,
    };

    return {
        buttonStyle,
        titleColor,
    };
}

// function useButtonStyles(
//     type: string,
//     disabled?: boolean,
//     nulledColor?: ColorVariants,
// ) {
//     let backgroundColor: ColorVariants = ColorVariants.Transparent;
//     let borderColor: ColorVariants = ColorVariants.Transparent;
//     let titleColor: ColorVariants = ColorVariants.TextAccent;
//     let borderRadius: number = 0;
//     let borderWidth: number = 0;
//
//     if (type === UIBoxButtonType.Primary) {
//         if (disabled) {
//             backgroundColor = ColorVariants.BackgroundTertiary;
//             titleColor = ColorVariants.TextTertiary;
//         } else {
//             backgroundColor = ColorVariants.BackgroundAccent;
//             titleColor = ColorVariants.StaticTextPrimaryLight;
//         }
//         borderRadius = UIConstant.alertBorderRadius;
//     } else if (type === UIBoxButtonType.Secondary) {
//         if (disabled) {
//             backgroundColor = ColorVariants.BackgroundTertiary;
//             titleColor = ColorVariants.TextTertiary;
//         } else {
//             backgroundColor = ColorVariants.BackgroundPrimaryInverted;
//             titleColor = ColorVariants.TextPrimaryInverted;
//         }
//         borderRadius = UIConstant.alertBorderRadius;
//     } else if (type === UIBoxButtonType.Tertiary) {
//         if (disabled) {
//             borderColor = ColorVariants.BackgroundTertiary;
//             titleColor = ColorVariants.TextTertiary;
//         } else {
//             borderColor = ColorVariants.BackgroundPrimaryInverted;
//             titleColor = ColorVariants.TextPrimary;
//         }
//         borderRadius = UIConstant.alertBorderRadius;
//         borderWidth = UIConstant.buttonBorderWidth;
//     } else if (type === UIBoxButtonType.Nulled) {
//         if (disabled) {
//             titleColor = ColorVariants.TextTertiary;
//         } else {
//             titleColor = nulledColor || ColorVariants.TextAccent;
//         }
//     }
//
//     const theme = useTheme();
//
//     const buttonStyle = {
//         backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
//         borderColor: theme[ColorVariants[borderColor]] as ColorValue,
//         borderRadius,
//         borderWidth,
//     };
//
//     return {
//         buttonStyle,
//         titleColor,
//     };
// }

export const UIBoxButton = ({
    disabled,
    icon,
    iconPosition = UIBoxButtonIconPosition.Left,
    layout,
    loading,
    // nulledColor,
    onPress,
    testID,
    title,
    type= UIBoxButtonType.Primary,
    variant = UIBoxButtonVariant.Default,
}: UIBoxButtonProps) => {
    const { buttonStyle, titleColor } = useButtonStyles(type, variant, disabled, loading);
    // const { buttonStyle, titleColor } = useButtonStyles(type, variant, disabled, nulledColor);
    return (
        <Button
            containerStyle={[
                styles.container,
                buttonStyle,
                layout,
            ]}
            contentStyle={styles.content}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UIBoxButtonIconPosition.Left && icon &&
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        tintColor={titleColor}
                    />
                }
                <Button.Title titleColor={titleColor}>{title}</Button.Title>
                {
                    iconPosition === UIBoxButtonIconPosition.Middle && icon &&
                    <Button.Icon source={icon} tintColor={titleColor} />
                }
            </Button.Content>
            {
                iconPosition === UIBoxButtonIconPosition.Right && icon &&
                <Button.Icon source={icon} tintColor={titleColor} />
            }
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
