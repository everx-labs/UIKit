import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIConstant as UINavConstant } from './constants';
import { UIHeaderItems } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';

type UIDialogBarProps = {
    testID?: string;
    headerLeftItems?: HeaderItem[];
    headerRightItems?: HeaderItem[];
    hasPuller?: boolean;
};

export function UIDialogBar({
    testID,
    headerLeftItems,
    headerRightItems,
    hasPuller = true,
}: UIDialogBarProps) {
    return (
        <UIBackgroundView style={styles.container} testID={testID}>
            <View style={styles.headerLeftItems}>
                <UIHeaderItems items={headerLeftItems} />
            </View>
            {hasPuller ? (
                <UIBackgroundView color={ColorVariants.BackgroundNeutral} style={styles.puller} />
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
        minHeight: UINavConstant.headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UIConstant.smallContentOffset(),
        paddingHorizontal: 0,
    },
    puller: {
        width: 32,
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
