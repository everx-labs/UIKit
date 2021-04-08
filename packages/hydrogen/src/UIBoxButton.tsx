import * as React from 'react';
import {ImageSourcePropType, StyleSheet} from 'react-native';

import {Button} from './Button';
import {UIConstant} from './constants';
import {ColorVariants, useTheme} from "./Colors";

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
     * - `left` - icon to the left near the title
     * - `middle` - icon to the right near the title
     * - `right` - icon at the end of the button
     */
    iconPosition?: 'left' | 'middle' | 'right';
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
     * - `primary` - button with current theme primary background color
     * - `secondary` - button with current theme secondary background color
     * - `tertiary` - button with 1 px border style
     * - `nulled` - button without visible borders and background color
     */
    type?: 'primary' | 'secondary' | 'tertiary' | 'nulled';
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
    if (type === 'primary') {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
            titleColor = ColorVariants.StaticTextPrimaryLight;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === 'secondary') {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            backgroundColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimaryInverted;
        }
        borderRadius = UIConstant.alertBorderRadius;
    } else if (type === 'tertiary') {
        if (disabled) {
            borderColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary;
        } else {
            borderColor = ColorVariants.BackgroundPrimaryInverted;
            titleColor = ColorVariants.TextPrimary;
        }
        borderRadius = UIConstant.alertBorderRadius;
        borderWidth = UIConstant.buttonBorderWidth;
    } else if (type === 'nulled') {
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
    iconPosition = 'left',
    loading,
    onPress,
    testID,
    title,
    type= 'primary'
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
            <Button.Content style={styles.content}>
                {
                    iconPosition === 'left' && icon &&
                    <Button.Icon source={icon} />
                }
                <Button.Title titleColor={titleColor}>{title}</Button.Title>
                {
                    iconPosition === 'middle' && icon &&
                    <Button.Icon source={icon} size="small" />
                }
            </Button.Content>
            {
                (type === 'primary' || type === 'secondary') &&
                icon && iconPosition === 'right' &&
                <Button.Icon
                    source={icon}
                />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.boxButtonHeight,
        width: 250,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
    },
});
