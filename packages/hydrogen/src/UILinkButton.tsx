import * as React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

import { Button, UILayout } from './Button';
import { UIConstant } from './constants';
import { ColorVariants } from './Colors';

// eslint-disable-next-line no-shadow
export enum UILinkButtonIconPosition {
    Left = 'Left',
    Middle = 'Middle',
    Right = 'Right',
}

export type UILinkButtonProps = {
    icon?: ImageSourcePropType;
    iconPosition?: UILinkButtonIconPosition;
    layout?: UILayout;
    onPress?: () => void | Promise<void>;
    testID?: string;
    title: string;
}

export const UILinkButton = ({
    icon,
    iconPosition = UILinkButtonIconPosition.Middle,
    layout,
    onPress,
    testID,
    title,
}: UILinkButtonProps) => {
    return (
        <Button
            containerStyle={[
                styles.container,
                layout,
            ]}
            onPress={onPress}
            testID={testID}
        >
            <Button.Content>
                {
                    iconPosition === UILinkButtonIconPosition.Left && icon &&
                    <Button.Icon
                        source={icon}
                        style={styles.leftIcon}
                        tintColor={ColorVariants.IconAccent}
                    />
                }
                <Button.Title titleColor={ColorVariants.TextAccent}>{title}</Button.Title>
                {
                    iconPosition === UILinkButtonIconPosition.Middle && icon &&
                    <Button.Icon source={icon} tintColor={ColorVariants.IconAccent} />
                }
            </Button.Content>
            {
                iconPosition === UILinkButtonIconPosition.Right && icon &&
                <Button.Icon source={icon} tintColor={ColorVariants.IconAccent} />
            }
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.linkButtonHeight,
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
    },
});
