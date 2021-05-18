import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleSheet } from 'react-native';

import { Button, ButtonIconSize, UILayout } from './Button';
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
     * Color of the UIBoxButtonType.Nulled button title
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
};

function useButtonStyles(
    type: string,
    disabled?: boolean,
    nulledColor?: ColorVariants,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let borderColor: ColorVariants = ColorVariants.Transparent;
    let titleColor: ColorVariants = ColorVariants.TextAccent;
    let borderRadius: number = 0;
    let borderWidth: number = 0;

    if (type === UIBoxButtonType.Primary) {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
            titleColor = ColorVariants.StaticTextPrimaryLight;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === UIBoxButtonType.Secondary) {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimaryInverted;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === UIBoxButtonType.Tertiary) {
        if (disabled) {
            borderColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            borderColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimary;
        }
        borderRadius = UIConstant.alertBorderRadius;
        borderWidth = UIConstant.buttonBorderWidth;
    } else if (type === UIBoxButtonType.Nulled) {
        if (disabled) {
            titleColor = ColorVariants.TextTertiary;
        } else {
            titleColor = nulledColor || ColorVariants.TextAccent;
        }
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderColor: theme[ColorVariants[borderColor]] as ColorValue,
        borderRadius,
        borderWidth,
    };

    return {
        buttonStyle,
        titleColor,
    };
}

export const UIBoxButton = ({
    disabled,
    icon,
    iconPosition = UIBoxButtonIconPosition.Left,
    layout,
    loading,
    nulledColor,
    onPress,
    testID,
    title,
    type= UIBoxButtonType.Primary
}: UIBoxButtonProps) => {
    const { buttonStyle, titleColor } = useButtonStyles(type, disabled, nulledColor);
    return (
        <Button
            containerStyle={[
                styles.container,
                buttonStyle,
                layout,
            ]}
            disabled={disabled}
            loading={loading}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UIBoxButtonIconPosition.Left && icon &&
                    <Button.Icon source={icon} style={styles.leftIcon} />
                }
                <Button.Title titleColor={titleColor}>{title}</Button.Title>
                {
                    iconPosition === UIBoxButtonIconPosition.Middle && icon &&
                    <Button.Icon source={icon} size={ButtonIconSize.Small} style={styles.middleIcon} />
                }
            </Button.Content>
            {
                (type === UIBoxButtonType.Primary || type === UIBoxButtonType.Secondary) &&
                icon && iconPosition === UIBoxButtonIconPosition.Right &&
                <Button.Icon source={icon} style={styles.rightIcon} />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.boxButtonHeight,
        padding: UIConstant.normalContentOffset,
    },
    leftIcon: {
        marginRight: 10,
    },
    middleIcon: {
        marginLeft: 6,
    },
    rightIcon: {
        marginLeft: 6,
        marginRight: 4,
    },
});
