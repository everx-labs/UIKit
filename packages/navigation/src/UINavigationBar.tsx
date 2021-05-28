import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

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

function useHeaderLeft(
    headerLeft?: () => React.ReactNode,
    headerLeftItems?: HeaderItem[],
    headerBackButton?: HeaderItem,
) {
    const navigation = useNavigation();

    if (headerLeft != null) {
        return headerLeft();
    }

    if (headerLeftItems != null) {
        return <UIHeaderItems items={headerLeftItems} />;
    }

    if (navigation.canGoBack()) {
        const defaultBackButton: HeaderItem = {
            testID: 'uinavigation-back-button',
            icon: {
                source: UIAssets.icons.ui.arrowLeftBlack,
            },
            iconTintColor: ColorVariants.IconAccent,
            onPress: navigation.goBack,
        };

        if (headerBackButton != null) {
            return (
                <UIHeaderItems
                    items={[
                        {
                            ...defaultBackButton,
                            ...headerBackButton,
                        },
                    ]}
                />
            );
        }

        return <UIHeaderItems items={[defaultBackButton]} />;
    }

    return null;
}

export type UINavigationBarProps = {
    testID?: string;
    headerLeft?: () => React.ReactNode;
    headerLeftItems?: HeaderItem[];
    /**
     * Configuration for header back button only
     */
    headerBackButton?: HeaderItem;
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
    headerBackButton,
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

    const headerLeftElement = useHeaderLeft(
        headerLeft,
        headerLeftItems,
        headerBackButton,
    );

    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>{headerLeftElement}</View>
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
