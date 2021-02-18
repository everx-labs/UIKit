import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { HEADER_HEIGHT } from './constants';
import { UIHeaderItems } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';

type UISlideBarProps = {
    testID?: string;
    headerLeftItems?: HeaderItem[];
    headerRightItems?: HeaderItem[];
    hasPuller: boolean;
};

export function UISlideBar({
    testID,
    headerLeftItems,
    headerRightItems,
    hasPuller = true,
}: UISlideBarProps) {
    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>
                <UIHeaderItems items={headerLeftItems} />
            </View>
            {hasPuller ? (
                <UIBackgroundView
                    color={ColorVariants.BackgroundNeutral}
                    style={styles.puller}
                />
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
        minHeight: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UIConstant.smallContentOffset(),
        paddingHorizontal: 16,
    },
    puller: {
        width: 64,
        height: 2,
        borderRadius: 2,
        marginHorizontal: UIConstant.smallContentOffset(),
    },
    emptyDivider: {
        marginHorizontal: UIConstant.smallContentOffset(),
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
