import * as React from 'react';
import { ImageProps, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import { UILabel, UILabelColors, UILabelRoles, ColorVariants } from '@tonlabs/uikit.themes';

import { UIConstant as UINavConstant } from './constants';

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
    iconTintColor = ColorVariants.GraphAccent,
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
}: {
    testID?: string;
    disabled?: boolean;
    onPress?: OnPress;
    children: React.ReactNode;
}) {
    return (
        <>
            <TouchableOpacity
                testID={testID}
                containerStyle={styles.headerItemTouchable}
                disabled={disabled}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        </>
    );
}

function UIHeaderItem(item: HeaderItem) {
    const { testID, label, icon, iconElement, disabled, onPress } = item;
    if (label != null) {
        return (
            <UIHeaderItemPressable testID={testID} disabled={disabled} onPress={onPress}>
                <UIHeaderActionItem {...item} />
            </UIHeaderItemPressable>
        );
    }
    if (icon != null || iconElement != null) {
        return (
            <UIHeaderItemPressable
                testID={item.testID}
                disabled={item.disabled}
                onPress={item.onPress}
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
                <UIHeaderItem key={index} {...item} />
            ))}
        </>
    );
}

/**
 * Fasten your seatbelt,
 * here is long story why we can't use hitSlop.
 *
 * We have 2 TouchableOpacity implementations that we're using:
 * 1. is from RN
 * 2. is from `react-native-gesture-handler`
 *
 * Even though docs from RNGH says
 * "Our touchable implementation follows the same API
 *  and aims to be a drop-in replacement for touchables available in React Native"
 *  (source - https://github.com/software-mansion/react-native-gesture-handler/blob/master/docs/docs/api/components/touchables.md)
 * it's not entirely true.
 * And one of major differences is the hitSlop prop.
 *
 * To understand why it's different we need to take a look into internals.
 *
 * The main difference isn't actually about TouchableOpacity,
 * but rather about how touch events work in RN.
 *
 * Out-of-the-box in RN touch events are actually abstracted away of
 * native implementation, we even can say that it's replaced.
 * Actually events are registered for root view,
 * and then processed through available tree of views.
 * https://github.com/facebook/react-native/blob/1465c8f3874cdee8c325ab4a4916fda0b3e43bdb/ReactAndroid/src/main/java/com/facebook/react/uimanager/JSTouchDispatcher.java#L73-L80
 * So basically this way RN don't rely on native mechanics
 * for identification of responder.
 *
 * RNGH implementation is actually adaptation of native touch handling.
 *
 * In most cases that works identical, but in case of hitSlops Android steps up.
 * Actually in Android views intercept events when they happen inside bounds,
 * and to intercept it over bounds you have to listen for all events in an activity,
 * that isn't trivial to make as a general case.
 * Actually even doc suggest not to use positive hitSlop for gesture handlers
 * (source - https://github.com/software-mansion/react-native-gesture-handler/blob/b4296b0224fe20b4619e36f408b8f7fc35b0d877/docs/versioned_docs/version-2.1.0/api/gestures/base-gesture-config.md#hitslopsettings)
 * and button is just a gesture handler - https://github.com/software-mansion/react-native-gesture-handler/blob/b4296b0224fe20b4619e36f408b8f7fc35b0d877/src/handlers/createNativeWrapper.tsx#L62-L67
 *
 * Conclusion - if we want to catch event in cross-platform maner,
 * we have to expand bounds of view, like to use paddings instead of hitSlop.
 *
 * Another important thing is events handling on web.
 * The way it works not (only bounds of a view) is a tradeoff,
 * and there was a dicussion on how it should work in rn-web:
 * https://github.com/necolas/react-native-web/issues/1609
 * So for now web works identicall to Android RNGH implementation.
 * That supports the conclusion to use paddings, if you want to have
 * increased clickable area.
 */
export const hitSlop = {
    top: UILayoutConstant.contentInsetVerticalX4,
    bottom: UILayoutConstant.contentInsetVerticalX4,
    // it's non-standart to achieve 26 (by design) between items
    left: UINavConstant.headerItemHorizontalInset,
    right: UINavConstant.headerItemHorizontalInset,
};

const styles = StyleSheet.create({
    headerItemTouchable: {
        paddingLeft: hitSlop.left,
        paddingRight: hitSlop.right,
        justifyContent: 'center',
    },
    headerIcon: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    headerItemMargin: {
        marginLeft: 26,
    },
});
