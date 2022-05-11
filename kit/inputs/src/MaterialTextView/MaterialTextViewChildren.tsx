import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage, UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type {
    MaterialTextViewIconProps,
    MaterialTextViewActionProps,
    MaterialTextViewTextProps,
} from './types';

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
        <TouchableOpacity onPress={onPress} style={[styles.iconTapZone, containerStyle]}>
            <UIAnimatedImage
                {...rest}
                style={[styles.iconSize, style]}
                // entering={FadeIn}
                // exiting={FadeOut}
            />
        </TouchableOpacity>
    );
}

export function MaterialTextViewAction({ children, onPress }: MaterialTextViewActionProps) {
    const processedChildren = processChildren(children, ColorVariants.TextPrimary);

    return (
        <TouchableOpacity onPress={onPress}>
            <Animated.View
                style={styles.actionContainer}
                // entering={FadeIn}
                // exiting={FadeOut}
            >
                {processedChildren}
            </Animated.View>
        </TouchableOpacity>
    );
}

export function MaterialTextViewText({ children }: MaterialTextViewTextProps) {
    const processedChildren = processChildren(children, ColorVariants.TextTertiary);

    return (
        <Animated.View
            style={styles.textContainer}
            // entering={FadeIn}
            // exiting={FadeOut}
        >
            {processedChildren}
        </Animated.View>
    );
}

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
