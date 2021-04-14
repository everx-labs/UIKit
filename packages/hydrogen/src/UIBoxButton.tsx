import * as React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

import { Button, ButtonIconSize } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

// eslint-disable-next-line no-shadow
export enum UIBoxButtonTypes {
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
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press
     */
    onPress: () => void;
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
     * - `UIBoxButtonTypes.Primary` - button with current theme primary background color
     * - `UIBoxButtonTypes.Secondary` - button with current theme secondary background color
     * - `UIBoxButtonTypes.Tertiary` - button with 1 px border style
     * - `UIBoxButtonTypes.Nulled` - button without visible borders and background color
     */
    type?: UIBoxButtonTypes;
};

function useButtonStyles(
    type: string,
    disabled?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let borderColor: ColorVariants = ColorVariants.Transparent;
    let titleColor: ColorVariants = ColorVariants.TextAccent;
    let borderRadius: number = 0;
    let borderWidth: number = 0;
    if (type === UIBoxButtonTypes.Primary) {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
            titleColor = ColorVariants.StaticTextPrimaryLight;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === UIBoxButtonTypes.Secondary) {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimaryInverted;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === UIBoxButtonTypes.Tertiary) {
        if (disabled) {
            borderColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            borderColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimary;
        }
        borderRadius = UIConstant.alertBorderRadius;
        borderWidth = UIConstant.buttonBorderWidth;
    } else if (type === UIBoxButtonTypes.Nulled) {
        if (disabled) {
            titleColor = ColorVariants.TextTertiary;
        } else {
            titleColor = ColorVariants.TextAccent;
        }
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]],
        borderColor: theme[ColorVariants[borderColor]],
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
    loading,
    onPress,
    testID,
    title,
    type= UIBoxButtonTypes.Primary
}: UIBoxButtonProps) => {
    const { buttonStyle, titleColor } = useButtonStyles(type, disabled);
    return (
        <Button
            containerStyle={[
                styles.container,
                // @ts-ignore
                buttonStyle,
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
                (type === UIBoxButtonTypes.Primary || type === UIBoxButtonTypes.Secondary) &&
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
        marginRight: 4,
    },
});
