import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
    UIBackgroundView,
    ColorVariants,
    UITextView,
    UITextViewProps,
    UIImage,
    UILabel,
    UILabelRoles,
    UILabelColors,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { HEADER_HEIGHT } from './constants';

type OnPress = <T = void>() => T | Promise<T>;

type UISearchBarRightButtonProps = {
    /**
     * Label text for button
     */
    label?: string;
    /**
     *
     */
    onPress?: OnPress;
    /**
     * Accessibility label for the button for screen readers.
     */
    accessibilityLabel?: string;
};

function renderRightAction({ label, onPress }: UISearchBarRightButtonProps) {
    if (label == null) {
        return null;
    }

    return (
        <TouchableOpacity
            hitSlop={{
                top: UIConstant.smallContentOffset(),
                bottom: UIConstant.smallContentOffset(),
                left: UIConstant.contentOffset(),
                right: UIConstant.contentOffset(),
            }}
            onPress={onPress}
            style={styles.actionButton}
        >
            <UILabel
                role={UILabelRoles.Action}
                color={UILabelColors.TextAccent}
            >
                {label}
            </UILabel>
        </TouchableOpacity>
    );
}

type UISearchBarProps = Omit<UITextViewProps, 'placeholder'> & {
    /**
     * Configuration for right item
     * Action button by default
     */
    headerRight?: (props: UISearchBarRightButtonProps) => React.ReactNode;
    /**
     * Label that will be passed to headerRight
     */
    headerRightLabel?: string;
    /**
     * onPress handler that will be passed to headerRight
     */
    headerRightOnPress?: OnPress;
};

export function UISearchBar({
    headerRight = renderRightAction,
    headerRightLabel,
    headerRightOnPress,
    ...inputProps
}: UISearchBarProps) {
    return (
        <UIBackgroundView style={styles.container}>
            <UIBackgroundView
                style={styles.searchContainer}
                color={ColorVariants.BackgroundSecondary}
            >
                <UIImage
                    source={UIAssets.icons.ui.search}
                    style={styles.searchIcon}
                    tintColor={ColorVariants.IconSecondary}
                />
                <UITextView placeholder={uiLocalized.Search} {...inputProps} />
            </UIBackgroundView>
            {headerRight({
                label: headerRightLabel,
                onPress: headerRightOnPress,
            })}
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UIConstant.smallContentOffset(),
        paddingHorizontal: UIConstant.contentOffset(),
    },
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
    actionButton: {
        marginLeft: UIConstant.contentOffset(),
    },
});
