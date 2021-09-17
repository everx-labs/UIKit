import * as React from 'react';
import { ImageProps, ImageStyle, View, StyleProp, StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    ColorVariants,
    UIImage,
    UILabel,
    UILabelColors,
    UILabelRoles,
    TouchableOpacity,
} from '@tonlabs/uikit.hydrogen';

type OnPress = () => void | Promise<void>;

export type HeaderItem = {
    /**
     * Id to test things
     */
    testID?: string;
    /**
     * Label text for button
     */
    label?: string;
    /**
     * Accessibility label for the button for screen readers.
     */
    accessibilityLabel?: string;
    /**
     * Icon source
     * Have default size: UIConstant.iconSize()
     */
    icon?:
        | ImageProps
        | ((props: {
              style: StyleProp<ImageStyle>;
              tintColor?: ColorVariants | null;
          }) => JSX.Element);
    /**
     * Icon react node
     */
    iconElement?: JSX.Element;
    /**
     * Color variant for icon
     */
    iconTintColor?: ColorVariants | null;
    /**
     * Whether the press behavior is disabled
     */
    disabled?: boolean;
    /**
     * Press handler
     */
    onPress?: OnPress;
};

function UIHeaderActionItem({ disabled, label, accessibilityLabel }: HeaderItem) {
    return (
        <UILabel
            role={UILabelRoles.Action}
            color={disabled ? UILabelColors.TextNeutral : UILabelColors.TextAccent}
            accessibilityLabel={accessibilityLabel}
        >
            {label}
        </UILabel>
    );
}

function UIHeaderIconItem({
    disabled,
    icon,
    iconElement,
    iconTintColor = ColorVariants.IconAccent,
}: HeaderItem): JSX.Element | null {
    if (iconElement) {
        return iconElement;
    }

    const tintColor = disabled ? ColorVariants.IconNeutral : iconTintColor;

    if (icon) {
        if (typeof icon === 'function') {
            return icon({
                style: styles.headerIcon,
                tintColor,
            });
        }
        return <UIImage {...icon} style={[styles.headerIcon, icon.style]} tintColor={tintColor} />;
    }

    return null;
}

function UIHeaderItemPressable({
    testID,
    disabled,
    onPress,
    children,
    applyMargin,
}: {
    testID?: string;
    disabled?: boolean;
    onPress?: OnPress;
    children: React.ReactNode;
    applyMargin: boolean;
}) {
    return (
        <>
            <View style={applyMargin ? styles.headerItemMargin : null} />
            <TouchableOpacity
                testID={testID}
                hitSlop={{
                    top: UIConstant.smallContentOffset(),
                    bottom: UIConstant.smallContentOffset(),
                    left: UIConstant.contentOffset(),
                    right: UIConstant.contentOffset(),
                }}
                disabled={disabled}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        </>
    );
}

function UIHeaderItem({ applyMargin, ...item }: HeaderItem & { applyMargin: boolean }) {
    if (item.label != null) {
        return (
            <UIHeaderItemPressable
                testID={item.testID}
                disabled={item.disabled}
                onPress={item.onPress}
                applyMargin={applyMargin}
            >
                <UIHeaderActionItem {...item} />
            </UIHeaderItemPressable>
        );
    }
    if (item.icon != null || item.iconElement != null) {
        return (
            <UIHeaderItemPressable
                testID={item.testID}
                disabled={item.disabled}
                onPress={item.onPress}
                applyMargin={applyMargin}
            >
                <UIHeaderIconItem {...item} />
            </UIHeaderItemPressable>
        );
    }
    return null;
}

export function UIHeaderItems({ items = [] }: { items?: HeaderItem[] }) {
    return (
        <>
            {items.slice(0, 3).map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <UIHeaderItem key={index} {...item} applyMargin={index > 0} />
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    headerIcon: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
    },
    headerItemMargin: {
        marginLeft: 26,
    },
});
