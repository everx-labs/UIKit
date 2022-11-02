import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
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
        <TouchableOpacity onPress={onPress} style={[styles.iconTapZone, containerStyle]}>
            <UIImage {...rest} style={[styles.iconSize, style]} />
        </TouchableOpacity>
    );
}

export function MaterialTextViewAction({ children, onPress }: MaterialTextViewActionProps) {
    const processedChildren = processChildren(children, ColorVariants.TextPrimary);

    return (
        <TouchableOpacity onPress={onPress}>
            <Animated.View style={styles.actionContainer}>{processedChildren}</Animated.View>
        </TouchableOpacity>
    );
}

export function MaterialTextViewText({ children }: MaterialTextViewTextProps) {
    const processedChildren = processChildren(children, ColorVariants.TextTertiary);

    return <Animated.View style={styles.textContainer}>{processedChildren}</Animated.View>;
}

export const MaterialTextViewClearButton = React.memo(function MaterialTextViewClearButton({
    clear,
}: MaterialTextViewClearButtonProps) {
    return (
        <TouchableOpacity testID="clear_btn" style={styles.iconTapZone} onPress={clear}>
            <UIImage
                source={UIAssets.icons.ui.clear}
                tintColor={ColorVariants.BackgroundInverted}
                style={styles.iconSize}
            />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    iconTapZone: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
