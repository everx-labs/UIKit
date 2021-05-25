import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import {
    HEADER_HEIGHT,
    SCREEN_CONTENT_INSET_HORIZONTAL,
    CONTENT_INSET_VERTICAL_X2,
} from './constants';
import { UIHeaderItems } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';

const UIBackgroundViewAnimated = Animated.createAnimatedComponent(
    UIBackgroundView,
);

type UINavigationBarAnimatedTitleProps = {
    children: React.ReactNode;
    headerTitleOpacity: Animated.SharedValue<number>;
};

function UINavigationBarAnimatedTitle({
    children,
    headerTitleOpacity,
}: UINavigationBarAnimatedTitleProps) {
    const headerTitleStyle = useAnimatedStyle(() => {
        return {
            opacity: headerTitleOpacity.value,
        };
    });

    return (
        <UIBackgroundViewAnimated
            style={[styles.titleWrapper, headerTitleStyle]}
        >
            {children}
        </UIBackgroundViewAnimated>
    );
}

export type UINavigationBarProps = {
    testID?: string;
    headerLeft?: () => React.ReactNode; // TODO: should we limit it?
    headerLeftItems?: HeaderItem[];
    headerRight?: () => React.ReactNode; // TODO: should we limit it?
    headerRightItems?: HeaderItem[];
    /**
     * A title string
     */
    title?: string;
    /**
     * A caption string
     */
    caption?: string;
};

type PrivateProps = {
    headerTitleOpacity?: Animated.SharedValue<number>;
};

export function UINavigationBar({
    testID,
    headerLeft,
    headerLeftItems,
    headerRight,
    headerRightItems,
    title,
    caption,
    // private
    headerTitleOpacity,
}: UINavigationBarProps & PrivateProps) {
    const titleElement = title ? (
        <UILabel role={UILabelRoles.HeadlineHead}>{title}</UILabel>
    ) : null;
    const captionElement = caption ? (
        <UILabel
            role={UILabelRoles.ParagraphFootnote}
            color={UILabelColors.TextSecondary}
        >
            {caption}
        </UILabel>
    ) : null;

    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>
                {headerLeft == null ? (
                    <UIHeaderItems items={headerLeftItems} />
                ) : (
                    headerLeft()
                )}
            </View>
            {headerTitleOpacity != null ? (
                <UINavigationBarAnimatedTitle
                    headerTitleOpacity={headerTitleOpacity}
                >
                    {titleElement}
                    {captionElement}
                </UINavigationBarAnimatedTitle>
            ) : (
                <UIBackgroundView style={styles.titleWrapper}>
                    {titleElement}
                    {captionElement}
                </UIBackgroundView>
            )}
            <View style={styles.headerRightItems}>
                {headerRight == null ? (
                    <UIHeaderItems items={headerRightItems} />
                ) : (
                    headerRight()
                )}
            </View>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: CONTENT_INSET_VERTICAL_X2,
        paddingHorizontal: SCREEN_CONTENT_INSET_HORIZONTAL,
    },

    titleWrapper: {
        marginHorizontal: CONTENT_INSET_VERTICAL_X2,
    },
    headerLeftItems: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    headerRightItems: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
});
