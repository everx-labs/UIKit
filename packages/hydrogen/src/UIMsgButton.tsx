import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Button, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';
import { UILabelRoles } from './UILabel';

// eslint-disable-next-line no-shadow
export enum UIMsgButtonType {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Tertiary = 'Tertiary',
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
     * - `UIMsgButtonType.Primary` - button with current theme accent background color (default)
     * - `UIMsgButtonType.Secondary` - button with 1 px border style and current theme accent line border color
     * - `UIMsgButtonType.Tertiary` - button with 1 px border style and current theme tertiary line border color
     */
    type?: UIMsgButtonType;
}

function useButtonStyles(
    type: UIMsgButtonType,
    cornerPosition?: UIMsgButtonCornerPosition,
    disabled?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let borderColor: ColorVariants = ColorVariants.Transparent;
    let titleColor: ColorVariants = ColorVariants.TextAccent;
    let borderWidth: number = 0;
    let cornerStyle: StyleProp<ViewStyle>;

    if (type === UIMsgButtonType.Primary) {
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundTertiary;
            titleColor = ColorVariants.TextTertiary
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
            titleColor = ColorVariants.StaticTextPrimaryLight;
        }
    } else if (type === UIMsgButtonType.Secondary) {
        if (disabled) {
            borderColor = ColorVariants.LineTertiary;
            titleColor = ColorVariants.TextNeutral;
        } else {
            borderColor = ColorVariants.LineAccent;
            titleColor = ColorVariants.TextAccent;
        }
        backgroundColor = ColorVariants.BackgroundPrimary;
        borderWidth = UIConstant.buttonBorderWidth;
    } else if (type === UIMsgButtonType.Tertiary) {
        if (disabled) {
            titleColor = ColorVariants.TextNeutral;
        } else {
            titleColor = ColorVariants.TextPrimary;
        }
        backgroundColor = ColorVariants.BackgroundPrimary;
        borderColor = ColorVariants.LineTertiary;
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
        titleColor,
    };
}

export const UIMsgButton = ({
    caption,
    cornerPosition,
    disabled,
    icon,
    iconPosition = UIMsgButtonIconPosition.Left,
    layout,
    onPress,
    testID,
    title,
    type = UIMsgButtonType.Primary
}: UIMsgButtonProps) => {
    const { buttonStyle, titleColor } = useButtonStyles(type, cornerPosition, disabled);

    const [ content, container ] = React.useMemo(() => {
        if (title && caption) {
            return [
                (
                    <Button.Content
                        direction={Button.ContentDirection.Column}
                        style={styles.doubleLineContainer}
                    >
                        <Button.Title titleColor={titleColor}>
                            {title}
                        </Button.Title>
                        <Button.Title
                            titleColor={titleColor}
                            titleRole={UILabelRoles.ActionLabel}
                        >
                            {caption}
                        </Button.Title>
                    </Button.Content>
                ),
                null,
            ];
        }

        return [
            (
                <>
                    <Button.Content direction={Button.ContentDirection.Row}>
                        {
                            iconPosition === UIMsgButtonIconPosition.Left && icon &&
                            <Button.Icon
                                source={icon}
                                style={styles.leftIcon}
                                tintColor={titleColor}
                            />
                        }
                        {/* TODO: think about the case when there is no title, only icon */}
                        <Button.Title titleColor={titleColor}>{title}</Button.Title>
                        {
                            iconPosition === UIMsgButtonIconPosition.Middle && icon &&
                            <Button.Icon source={icon} tintColor={titleColor} />
                        }
                    </Button.Content>
                    {
                        iconPosition === UIMsgButtonIconPosition.Right && icon &&
                        <Button.Icon source={icon} tintColor={titleColor} />
                    }
                </>
            ),
            styles.singleLineContainer,
        ];
    }, [caption, icon, iconPosition, title, titleColor]);

    return (
        <Button
            containerStyle={[
                container,
                buttonStyle,
                layout,
            ]}
            disabled={disabled}
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
        paddingHorizontal: UIConstant.normalContentOffset,
    },
    doubleLineContainer: {
        padding: UIConstant.smallContentOffset,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
