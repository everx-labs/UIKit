import * as React from 'react';
import { StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/localization';

import { UIConstant as UINavConstant } from './constants';
import { UISearchController } from './UISearchController';

export function UISearchBarButton({
    testID,
    forId,
    placeholder,
    searchBarPlaceholder,
    searching,
    visible,
    onOpen,
    onClose,
    onChangeText,
    onDidHide,
    children,
}: {
    testID?: string;
    forId?: string;
    placeholder?: string;
    searchBarPlaceholder?: string;
    searching?: boolean;
    visible: boolean;
    onOpen: () => void | Promise<void>;
    onClose: () => void | Promise<void>;
    onChangeText?: React.ComponentProps<typeof UISearchController>['onChangeText'];
    onDidHide?: () => void | Promise<void>;
    children: ((searchText: string) => React.ReactNode) | React.ReactNode;
}) {
    return (
        <>
            <UIBackgroundView style={styles.container}>
                <TouchableOpacity
                    testID={testID || 'ui_search_bar_button'}
                    containerStyle={styles.touchable}
                    style={styles.touchable}
                    onPress={onOpen}
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
                            {placeholder || uiLocalized.Search}
                        </UILabel>
                    </UIBackgroundView>
                </TouchableOpacity>
            </UIBackgroundView>
            <UISearchController
                placeholder={searchBarPlaceholder || placeholder}
                forId={forId}
                visible={visible}
                onCancel={onClose}
                onChangeText={onChangeText}
                onDidHide={onDidHide}
                searching={searching}
            >
                {children}
            </UISearchController>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: UILayoutConstant.headerHeight,
        paddingVertical: UIConstant.smallContentOffset(),
    },
    touchable: { flex: 1 },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: UIConstant.mediumBorderRadius(),
        paddingLeft: 10,
        paddingRight: 14,
    },
    searchIcon: {
        width: UINavConstant.iconSearchSize,
        height: UINavConstant.iconSearchSize,
        marginRight: UIConstant.tinyContentOffset(),
    },
});
