import * as React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

import { Button } from './Button';
import { UIConstant } from './constants';
import { ColorVariants, useTheme } from './Colors';

// eslint-disable-next-line no-shadow
export enum UIMsgButtonCornerPosition {
    // BottomLeft = 'BottomLeft',
    // BottomRight = 'BottomRight',
    TopLeft = 'TopLeft',
    // TopRight = 'TopRight',
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
    console.log(cornerPosition);
    let backgroundColor: ColorVariants = ColorVariants.BackgroundAccent;
    let titleColor: ColorVariants = ColorVariants.StaticTextPrimaryLight;
    // let borderRadius: number = ;
    if (disabled) {
        backgroundColor = ColorVariants.BackgroundTertiary;
        titleColor = ColorVariants.TextTertiary;
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]],
        borderRadius: UIConstant.alertBorderRadius,
        borderTopLeftRadius: 0,
    };

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
                // @ts-ignore
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
            </Button.Content>
        </Button>
    )
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.msgButtonHeight,
        padding: UIConstant.smallContentOffset,
    },
    leftIcon: {
        marginRight: 10,
    },
});
