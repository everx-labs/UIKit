import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIAssets } from '@tonlabs/uikit.assets';
import type {
    InputIconProps,
    InputActionProps,
    InputTextProps,
    InputClearButtonProps,
} from './types';

function processChildren(
    children: React.ReactNode,
    tintColor: ColorVariants | undefined,
): React.ReactNode {
    return React.Children.map(children, (child: React.ReactNode) => {
        if (typeof child === 'string') {
            return (
                <UILabel role={UILabelRoles.Action} color={tintColor}>
                    {child}
                </UILabel>
            );
        }
        if (React.isValidElement(child) && child.type === UIImage) {
            return React.createElement(UIImage, {
                ...child.props,
                tintColor,
                style: {
                    ...styles.imageChild,
                    ...StyleSheet.flatten(child.props.style),
                },
            });
        }
        return child;
    });
}

export function InputIcon({ onPress, style, containerStyle, ...rest }: InputIconProps) {
    return (
        <UIPressableArea onPress={onPress} style={[styles.iconTapZone, containerStyle]}>
            <UIImage {...rest} style={[styles.iconSize, style]} />
        </UIPressableArea>
    );
}

export function InputAction({ children, disabled = false, onPress, tintColor }: InputActionProps) {
    const childrenTintColor = disabled
        ? ColorVariants.TextTertiary
        : tintColor || ColorVariants.TextPrimary;
    const processedChildren = processChildren(children, childrenTintColor);

    return (
        <UIPressableArea disabled={disabled} onPress={onPress} style={styles.actionContainer}>
            <View style={styles.actionContent}>{processedChildren}</View>
        </UIPressableArea>
    );
}

export function InputText({ children }: InputTextProps) {
    const processedChildren = processChildren(children, ColorVariants.TextTertiary);

    return (
        <Animated.View style={styles.textContainer}>
            <View style={styles.textContent}>{processedChildren}</View>
        </Animated.View>
    );
}

export const InputClearButton = React.memo(function InputClearButton({
    clear,
}: InputClearButtonProps) {
    return (
        <UIPressableArea testID="clear_btn" style={styles.iconTapZone} onPress={clear}>
            <UIImage
                source={UIAssets.icons.ui.clear}
                tintColor={ColorVariants.BackgroundPrimaryInverted}
                style={styles.iconSize}
            />
        </UIPressableArea>
    );
});

const styles = StyleSheet.create({
    iconTapZone: {
        alignSelf: 'stretch',
        paddingHorizontal: UILayoutConstant.contentOffset,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    actionContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        userSelect: 'none',
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    textContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    textContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
