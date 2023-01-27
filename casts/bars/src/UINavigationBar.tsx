import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    useBackgroundColorStyle,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant as UINavConstant } from './constants';
import { UIHeaderItems, hitSlop } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';
import { useNavigationHeaderLeftItems } from './useNavigationHeaderLeftItems';

type UINavigationBarAnimatedTitleProps = {
    children: React.ReactNode;
    headerTitleOpacity: Animated.SharedValue<number>;
};

function UINavigationBarAnimatedTitle({
    children,
    headerTitleOpacity,
}: UINavigationBarAnimatedTitleProps) {
    const colorStyle = useBackgroundColorStyle();
    const headerTitleStyle = useAnimatedStyle(() => {
        return {
            opacity: headerTitleOpacity.value,
        };
    });

    return (
        <Animated.View style={[styles.titleInner, colorStyle, headerTitleStyle]}>
            {children}
        </Animated.View>
    );
}

export type UINavigationBarProps = {
    /**
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Method to render any content of the left side of header.
     * Has a higer priority then `headerLeftItems`.
     */
    headerLeft?: () => React.ReactNode;
    /**
     * Set of items to render on the left side of header.
     * Limited to 3 items.
     */
    headerLeftItems?: HeaderItem[];
    /**
     * Configuration for header back button only.
     *
     * Usefull if you want to customise back button,
     * but doesn't want to provide all the `HeaderItem`
     * options themself.
     * (It will be merged with default,
     *  so for example you don't need to pass `onPress`
     *  to have a proper behaviour)
     */
    headerBackButton?: HeaderItem;
    /**
     * Method to render any content of the right side of header.
     * Has a higer priority then `headerRightItems`.
     */
    headerRight?: () => React.ReactNode; // TODO: should we limit it?
    /**
     * Set of items to render on the left side of header.
     * Limited to 3 items.
     */
    headerRightItems?: HeaderItem[];
    /**
     * String to display in the header as title. Defaults to scene `title`.
     */
    title?: React.ReactNode | string;
    /**
     * testID for title string
     */
    titleTestID?: string;
    /**
     * A caption string
     */
    caption?: string;
    /**
     * testID for caption string
     */
    captionTestID?: string;
    /**
     * A callback that fires when user taps on title area (including caption)
     */
    onTitlePress?: () => void;
};

type PrivateProps = {
    headerTitleOpacity?: Animated.SharedValue<number>;
};

export const UINavigationBar = React.memo(function UINavigationBar({
    testID,
    headerLeft,
    headerLeftItems,
    headerBackButton,
    headerRight,
    headerRightItems,
    title,
    titleTestID,
    caption,
    captionTestID,
    onTitlePress,
    // private
    headerTitleOpacity,
}: UINavigationBarProps & PrivateProps) {
    let titleElement: React.ReactNode = null;
    if (React.isValidElement(title)) {
        titleElement = title;
    } else if (title != null) {
        titleElement = (
            <UILabel
                testID={titleTestID}
                role={UILabelRoles.HeadlineHead}
                adjustsFontSizeToFit
                minimumFontScale={UINavConstant.titleMinimumFontScale}
                numberOfLines={1}
                ellipsizeMode="middle"
            >
                {title}
            </UILabel>
        );
    }

    const captionElement = caption ? (
        <UILabel
            testID={captionTestID}
            role={UILabelRoles.ParagraphFootnote}
            color={UILabelColors.TextSecondary}
        >
            {caption}
        </UILabel>
    ) : null;

    const headerLeftElement = useNavigationHeaderLeftItems(
        headerLeft,
        headerLeftItems,
        headerBackButton,
    );

    const titleInnerElement =
        onTitlePress != null ? (
            <TouchableOpacity onPress={onTitlePress} style={styles.titleInner}>
                {titleElement}
                {captionElement}
            </TouchableOpacity>
        ) : (
            <>
                {titleElement}
                {captionElement}
            </>
        );

    let headerRightElement = null;

    if (headerRight != null) {
        headerRightElement = headerRight();
    } else if (headerRightItems != null && headerRightItems.length > 0) {
        headerRightElement = <UIHeaderItems items={headerRightItems} />;
    }

    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>{headerLeftElement}</View>
            <View style={styles.headerRightItems}>{headerRightElement}</View>
            <View style={styles.titleContainer} pointerEvents="box-none">
                {headerTitleOpacity != null ? (
                    <UINavigationBarAnimatedTitle headerTitleOpacity={headerTitleOpacity}>
                        {titleInnerElement}
                    </UINavigationBarAnimatedTitle>
                ) : (
                    <UIBackgroundView style={styles.titleInner}>
                        {titleInnerElement}
                    </UIBackgroundView>
                )}
            </View>
        </UIBackgroundView>
    );
});

const styles = StyleSheet.create({
    container: {
        height: UILayoutConstant.headerHeight,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    titleContainer: {
        position: 'absolute',
        top: UILayoutConstant.contentInsetVerticalX2,
        bottom: UILayoutConstant.contentInsetVerticalX2,
        left:
            UILayoutConstant.iconSize +
            UILayoutConstant.contentInsetVerticalX2 +
            UINavConstant.scrollContentInsetHorizontal,
        right:
            UILayoutConstant.iconSize +
            UILayoutConstant.contentInsetVerticalX2 +
            UINavConstant.scrollContentInsetHorizontal,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    titleInner: {
        flexDirection: 'column',
        alignItems: 'center',
        ...Platform.select({
            web: {
                maxWidth: '100%',
            },
            default: null,
        }),
    },
    headerLeftItems: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        // Since we don't use real hitSlop
        // but padding instead,
        // need to apply padding here to compensate
        // applied insets for UIHeaderItem
        // e.g. it's 13 for a button,
        // and since we have 16 by design here
        // it should be 16 - 13 = 3
        paddingLeft: UINavConstant.scrollContentInsetHorizontal - hitSlop.left,
    },
    headerRightItems: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        paddingRight: UINavConstant.scrollContentInsetHorizontal - hitSlop.right,
    },
});
