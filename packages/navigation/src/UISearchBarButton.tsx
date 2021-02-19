import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIImage,
    UILabel,
    ColorVariants,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { HEADER_HEIGHT } from './constants';
import { UISearchController } from './UISearchController';

export function UISearchBarButton({
    forId,
    children,
}: {
    forId?: string;
    children: (searchText: string) => React.ReactNode;
}) {
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <UIBackgroundView style={styles.container}>
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => {
                        setVisible(true);
                    }}
                >
                    <UIBackgroundView
                        style={styles.searchContainer}
                        color={ColorVariants.BackgroundSecondary}
                    >
                        <UIImage
                            source={UIAssets.icons.ui.search}
                            style={styles.searchIcon}
                            tintColor={ColorVariants.IconSecondary}
                        />
                        <UILabel
                            role={UILabelRoles.ParagraphText}
                            color={UILabelColors.TextSecondary}
                        >
                            {uiLocalized.Search}
                        </UILabel>
                    </UIBackgroundView>
                </TouchableOpacity>
            </UIBackgroundView>
            <UISearchController
                forId={forId}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                {children}
            </UISearchController>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: HEADER_HEIGHT,
        paddingVertical: UIConstant.smallContentOffset(),
    },
    touchable: { flex: 1 },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: UIConstant.mediumBorderRadius(),
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    searchIcon: {
        width: UIConstant.iconSize(),
        height: UIConstant.iconSize(),
        marginRight: UIConstant.tinyContentOffset(),
    },
});
