import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIBackgroundView, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UIHeaderItems, hitSlop } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';
import { useNavigationHeaderLeftItems } from './useNavigationHeaderLeftItems';
import { UIConstant as UINavConstant } from './constants';

type UISlideBarProps = {
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
    headerRightItems?: HeaderItem[];
    hasPuller?: boolean;
};

export function UISlideBar({
    testID,
    headerLeft,
    headerLeftItems,
    headerBackButton,
    headerRightItems,
    hasPuller = true,
}: UISlideBarProps) {
    const headerLeftElement = useNavigationHeaderLeftItems(
        headerLeft,
        headerLeftItems,
        headerBackButton,
        false,
    );

    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>{headerLeftElement}</View>
            {hasPuller ? (
                <UIBackgroundView color={ColorVariants.BackgroundTertiary} style={styles.puller} />
            ) : (
                <View style={styles.emptyDivider} />
            )}
            <View style={styles.headerRightItems}>
                <UIHeaderItems items={headerRightItems} />
            </View>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: UILayoutConstant.headerHeight,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    puller: {
        width: 64,
        height: 2,
        borderRadius: 2,
        marginHorizontal: UIConstant.smallContentOffset(),
        alignSelf: 'center',
    },
    emptyDivider: {
        marginHorizontal: UIConstant.smallContentOffset(),
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
