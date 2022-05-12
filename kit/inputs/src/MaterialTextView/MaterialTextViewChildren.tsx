import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIAssets } from '@tonlabs/uikit.assets';
import type {
    MaterialTextViewIconProps,
    MaterialTextViewActionProps,
    MaterialTextViewTextProps,
    MaterialTextViewClearButtonProps,
} from './types';
import { UIConstants } from './constants';

const ICON_TAP_ZONE_SIZE = 48;

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

export function MaterialTextViewIcon({
    onPress,
    style,
    containerStyle,
    ...rest
}: MaterialTextViewIconProps) {
    return (
        <UIPressableArea
            onPress={onPress}
            style={[styles.iconTapZone, containerStyle]}
            scaleParameters={UIConstants.pressableIconScaleParameters}
        >
            <UIImage {...rest} style={[styles.iconSize, style]} />
        </UIPressableArea>
    );
}

export function MaterialTextViewAction({ children, onPress }: MaterialTextViewActionProps) {
    const processedChildren = processChildren(children, ColorVariants.TextPrimary);

    return (
        <UIPressableArea
            onPress={onPress}
            scaleParameters={UIConstants.pressableIconScaleParameters}
        >
            <Animated.View style={styles.actionContainer}>{processedChildren}</Animated.View>
        </UIPressableArea>
    );
}

export function MaterialTextViewText({ children }: MaterialTextViewTextProps) {
    const processedChildren = processChildren(children, ColorVariants.TextTertiary);

    return <Animated.View style={styles.textContainer}>{processedChildren}</Animated.View>;
}

export const MaterialTextViewClearButton = React.memo(function MaterialTextViewClearButton({
    inputHasValue,
    isFocused,
    isHovered,
    clear,
}: MaterialTextViewClearButtonProps) {
    if (inputHasValue && (isFocused || isHovered)) {
        console.log({ inputHasValue, isFocused, isHovered });
        return (
            <UIPressableArea
                testID="clear_btn"
                style={styles.iconTapZone}
                onPress={() => {
                    console.log('onPress');
                    clear?.();
                }}
                scaleParameters={UIConstants.pressableIconScaleParameters}
            >
                <UIImage
                    source={UIAssets.icons.ui.clear}
                    tintColor={ColorVariants.BackgroundPrimaryInverted}
                    style={styles.iconSize}
                />
            </UIPressableArea>
        );
    }

    return null;
});

const styles = StyleSheet.create({
    iconTapZone: {
        height: ICON_TAP_ZONE_SIZE,
        width: ICON_TAP_ZONE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
