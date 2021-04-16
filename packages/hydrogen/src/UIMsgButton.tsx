import * as React from 'react';
import { ColorValue, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Button, ButtonIconSize } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

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
    cornerPosition?: UIMsgButtonCornerPosition;
    disabled?: boolean;
    icon?: ImageSourcePropType;
    iconPosition?: UIMsgButtonIconPosition;
    onPress: () => void;
    testID?: string;
    title: string;
}

function useButtonStyles(
    cornerPosition: UIMsgButtonCornerPosition,
    disabled?: boolean,
) {
    let backgroundColor: ColorVariants = ColorVariants.BackgroundAccent;
    let titleColor: ColorVariants = ColorVariants.StaticTextPrimaryLight;
    let cornerStyle: StyleProp<ViewStyle>;
    if (disabled) {
        backgroundColor = ColorVariants.BackgroundTertiary;
        titleColor = ColorVariants.TextTertiary;
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
            borderRadius: UIConstant.alertBorderRadius,
        },
        cornerStyle,
    ];

    return {
        buttonStyle,
        titleColor,
    };
}

export const UIMsgButton = ({
    cornerPosition = UIMsgButtonCornerPosition.TopLeft,
    disabled,
    icon,
    iconPosition = UIMsgButtonIconPosition.Left,
    onPress,
    testID,
    title,
}: UIMsgButtonProps) => {
    const { buttonStyle, titleColor } = useButtonStyles(cornerPosition, disabled);
    return (
        <Button
            containerStyle={[
                styles.container,
                buttonStyle,
            ]}
            disabled={disabled}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UIMsgButtonIconPosition.Left && icon &&
                    <Button.Icon source={icon} style={styles.leftIcon} />
                }
                <Button.Title titleColor={titleColor}>{title}</Button.Title>
                {
                    iconPosition === UIMsgButtonIconPosition.Middle && icon &&
                    <Button.Icon source={icon} size={ButtonIconSize.Small} style={styles.middleIcon} />
                }
            </Button.Content>
            {
                iconPosition === UIMsgButtonIconPosition.Right && icon &&
                <Button.Icon source={icon} style={styles.rightIcon} />
            }
        </Button>
    )
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.msgButtonHeight,
        padding: UIConstant.smallContentOffset,
    },
    leftIcon: {
        marginLeft: 8,
        marginRight: 10,
    },
    middleIcon: {
        marginHorizontal: 6,
    },
    rightIcon: {
        marginHorizontal: 2,
    },
});
